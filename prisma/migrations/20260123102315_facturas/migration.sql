-- CreateTable
CREATE TABLE "Factura" (
    "id" TEXT NOT NULL,
    "contratoId" TEXT NOT NULL,
    "pagoId" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "monto" INTEGER NOT NULL,
    "estado" TEXT NOT NULL,
    "emitidaAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Factura_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Factura_pagoId_key" ON "Factura"("pagoId");

-- AddForeignKey
ALTER TABLE "Factura" ADD CONSTRAINT "Factura_contratoId_fkey" FOREIGN KEY ("contratoId") REFERENCES "Contrato"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Factura" ADD CONSTRAINT "Factura_pagoId_fkey" FOREIGN KEY ("pagoId") REFERENCES "Pago"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
