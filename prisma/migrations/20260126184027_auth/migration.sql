-- AlterEnum
ALTER TYPE "Role" RENAME TO "Rol";

-- AlterTable
ALTER TABLE "Usuario" RENAME COLUMN "role" TO "rol";
ALTER TABLE "Usuario" RENAME COLUMN "passwordHash" TO "password";
ALTER TABLE "Usuario" ADD COLUMN "activo" BOOLEAN NOT NULL DEFAULT true;
