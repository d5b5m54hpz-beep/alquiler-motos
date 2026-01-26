/*
  Warnings:

  - A unique constraint covering the columns `[cae]` on the table `Factura` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Factura" ADD COLUMN     "afipEstado" TEXT,
ADD COLUMN     "cae" TEXT,
ADD COLUMN     "caeVto" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Factura_cae_key" ON "Factura"("cae");
