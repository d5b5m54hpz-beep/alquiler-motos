/*
  Warnings:

  - You are about to alter the column `precioSemana` on the `Contrato` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Contrato" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clienteId" TEXT NOT NULL,
    "motoId" TEXT NOT NULL,
    "fechaInicio" DATETIME NOT NULL,
    "fechaFin" DATETIME NOT NULL,
    "precioSemana" REAL NOT NULL,
    "estado" TEXT NOT NULL,
    "duracionMeses" INTEGER,
    "tipoPago" TEXT,
    "precioMensual" REAL,
    "precioSemanal" REAL,
    "descuentoDuracion" REAL,
    "descuentoSemanal" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Contrato_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Contrato_motoId_fkey" FOREIGN KEY ("motoId") REFERENCES "Moto" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Contrato" ("clienteId", "createdAt", "estado", "fechaFin", "fechaInicio", "id", "motoId", "precioSemana", "updatedAt") SELECT "clienteId", "createdAt", "estado", "fechaFin", "fechaInicio", "id", "motoId", "precioSemana", "updatedAt" FROM "Contrato";
DROP TABLE "Contrato";
ALTER TABLE "new_Contrato" RENAME TO "Contrato";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
