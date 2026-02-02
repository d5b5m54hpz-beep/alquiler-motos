import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const [totalMotos, totalContratos, totalClientes, pagosPendientes, alertasNoLeidas] = await Promise.all([
    prisma.moto.count(),
    prisma.contrato.count(),
    prisma.cliente.count(),
    prisma.pago.count({ where: { estado: "pendiente" } }),
    prisma.alerta.count({ where: { leida: false } }),
  ]);

  return Response.json({
    totalMotos,
    totalContratos,
    totalClientes,
    pagosPendientes,
    alertasNoLeidas,
  });
}

