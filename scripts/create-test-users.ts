import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Operador
  const opHash = await bcrypt.hash("op123", 10);
  await prisma.usuario.upsert({
    where: { email: "operador@demo.com" },
    update: {},
    create: {
      email: "operador@demo.com",
      nombre: "Operador Demo",
      password: opHash,
      rol: "operador",
      activo: true,
    },
  });
  console.log("✅ operador@demo.com / op123");

  // Auditor
  const audHash = await bcrypt.hash("aud123", 10);
  await prisma.usuario.upsert({
    where: { email: "auditor@demo.com" },
    update: {},
    create: {
      email: "auditor@demo.com",
      nombre: "Auditor Demo",
      password: audHash,
      rol: "auditor",
      activo: true,
    },
  });
  console.log("✅ auditor@demo.com / aud123");

  const users = await prisma.usuario.findMany({
    select: { email: true, rol: true, activo: true },
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
