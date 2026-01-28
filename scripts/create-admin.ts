import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("admin123", 10);

  const user = await prisma.user.upsert({
    where: { email: "admin@demo.com" },
    update: {
      password: password,
      role: "admin",
    },
    create: {
      email: "admin@demo.com",
      name: "Admin",
      password: password,
      role: "admin",
      provider: "credentials",
    },
  });

  console.log("✅ Usuario admin creado/actualizado:", user.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
