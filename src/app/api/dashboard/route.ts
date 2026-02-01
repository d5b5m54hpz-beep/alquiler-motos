import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const days = Number(searchParams.get("days") ?? 30);

  const since = new Date();
  since.setDate(since.getDate() - days);

  const [pagos, contratos, alertas] = await Promise.all([
    prisma.pago.count({ where: { createdAt: { gte: since } } }),
    prisma.contrato.count({ where: { createdAt: { gte: since } } }),
    prisma.alerta.count({ where: { createdAt: { gte: since }, leida: false } }),
  ]);

  return Response.json({
    pagos,
    contratos,
    alertas,
  });
}

