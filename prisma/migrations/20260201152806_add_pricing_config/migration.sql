-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "provider" TEXT NOT NULL,
    "password" TEXT,
    "phone" TEXT,
    "phoneVerifiedAt" DATETIME,
    "role" TEXT NOT NULL DEFAULT 'cliente',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "nombre" TEXT,
    "email" TEXT NOT NULL,
    "telefono" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'pendiente',
    "preRegistro" JSONB,
    "aprobadoPor" TEXT,
    "aprobadoAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Cliente_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Moto" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "patente" TEXT NOT NULL,
    "anio" INTEGER NOT NULL,
    "estado" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Contrato" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clienteId" TEXT NOT NULL,
    "motoId" TEXT NOT NULL,
    "fechaInicio" DATETIME NOT NULL,
    "fechaFin" DATETIME NOT NULL,
    "precioSemana" INTEGER NOT NULL,
    "estado" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Contrato_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Contrato_motoId_fkey" FOREIGN KEY ("motoId") REFERENCES "Moto" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Pago" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "contratoId" TEXT NOT NULL,
    "monto" INTEGER NOT NULL,
    "metodo" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "referencia" TEXT,
    "pagadoAt" DATETIME,
    "vencimientoAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Pago_contratoId_fkey" FOREIGN KEY ("contratoId") REFERENCES "Contrato" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Factura" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "contratoId" TEXT NOT NULL,
    "pagoId" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "monto" INTEGER NOT NULL,
    "estado" TEXT NOT NULL,
    "emitidaAt" DATETIME NOT NULL,
    "cae" TEXT,
    "caeVto" DATETIME,
    "afipEstado" TEXT NOT NULL DEFAULT 'pendiente',
    "emailEnviado" BOOLEAN NOT NULL DEFAULT false,
    "emailAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Factura_contratoId_fkey" FOREIGN KEY ("contratoId") REFERENCES "Contrato" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Factura_pagoId_fkey" FOREIGN KEY ("pagoId") REFERENCES "Pago" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Alerta" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tipo" TEXT NOT NULL,
    "mensaje" TEXT NOT NULL,
    "contratoId" TEXT,
    "pagoId" TEXT,
    "leida" BOOLEAN NOT NULL DEFAULT false,
    "dniVerificacion" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Alerta_contratoId_fkey" FOREIGN KEY ("contratoId") REFERENCES "Contrato" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Alerta_pagoId_fkey" FOREIGN KEY ("pagoId") REFERENCES "Pago" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PricingConfig" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'default',
    "precioBaseMensual" REAL NOT NULL,
    "descuentoSemanal" REAL NOT NULL,
    "descuentoMeses3" REAL NOT NULL,
    "descuentoMeses6" REAL NOT NULL,
    "descuentoMeses9" REAL NOT NULL,
    "descuentoMeses12" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_userId_key" ON "Cliente"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_email_key" ON "Cliente"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Moto_patente_key" ON "Moto"("patente");

-- CreateIndex
CREATE UNIQUE INDEX "Factura_pagoId_key" ON "Factura"("pagoId");

-- CreateIndex
CREATE UNIQUE INDEX "PricingConfig_id_key" ON "PricingConfig"("id");
