-- Drop the problematic table and recreate with correct schema
DROP TABLE IF EXISTS "Contrato" CASCADE;
DROP TABLE IF EXISTS "Cliente" CASCADE;

-- Recreate Cliente with all fields
CREATE TABLE "Cliente" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "nombre" TEXT,
    "email" TEXT NOT NULL,
    "telefono" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'pendiente',
    "preRegistro" JSONB,
    "aprobadoPor" TEXT,
    "aprobadoAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- Create unique indexes
CREATE UNIQUE INDEX "Cliente_userId_key" ON "Cliente"("userId");
CREATE UNIQUE INDEX "Cliente_email_key" ON "Cliente"("email");

-- Add foreign key to User
ALTER TABLE "Cliente" ADD CONSTRAINT "Cliente_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Recreate Contrato
CREATE TABLE "Contrato" (
    "id" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "motoId" TEXT NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3) NOT NULL,
    "precioSemana" INTEGER NOT NULL,
    "estado" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contrato_pkey" PRIMARY KEY ("id")
);

-- Add foreign keys for Contrato
ALTER TABLE "Contrato" ADD CONSTRAINT "Contrato_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Contrato" ADD CONSTRAINT "Contrato_motoId_fkey" FOREIGN KEY ("motoId") REFERENCES "Moto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
