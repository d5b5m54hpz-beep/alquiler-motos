import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Operador
  const opHash = await bcrypt.hash("op123", 10);
  await prisma.user.upsert({
    where: { email: "operador@demo.com" },
    update: {},
    create: {
      email: "operador@demo.com",
      name: "Operador Demo",
      password: opHash,
      role: "operador",
      provider: "credentials",
    },
  });
  console.log("✅ operador@demo.com / op123");

  // Admin
  const adminHash = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@demo.com" },
    update: {},
    create: {
      email: "admin@demo.com",
      name: "Admin Demo",
      password: adminHash,
      role: "admin",
      provider: "credentials",
    },
  });
  console.log("✅ admin@demo.com / admin123");

  const users = await prisma.user.findMany({
    select: { email: true, role: true, provider: true },
  });
  console.log("\n📋 Todos los usuarios:");
  console.table(users);
}

main()
  .then(() => {
    console.log("\n✨ Test users creados/actualizados");
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
