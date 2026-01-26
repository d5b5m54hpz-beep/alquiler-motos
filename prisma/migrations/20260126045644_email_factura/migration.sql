-- DropIndex
DROP INDEX "Factura_cae_key";

-- AlterTable
ALTER TABLE "Factura" ADD COLUMN     "emailAt" TIMESTAMP(3),
ADD COLUMN     "emailEnviado" BOOLEAN NOT NULL DEFAULT false;
