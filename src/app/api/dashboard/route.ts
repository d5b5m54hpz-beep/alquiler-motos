import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const days = Number(searchParams.get("days") ?? 30);

  const since = new Date();
  since.setDate(since.getDate() - days);

  const ingresos = await prisma.pago.aggregate({
    _sum: { monto: true },
    where: {
      estado: "pagado",
      createdAt: { gte: since },
    },
  });

  const pagosPendientes = await prisma.pago.count({
    where: { estado: "pendiente" },
  });

  const alertasNoLeidas = await prisma.alerta.count({
    where: { leida: false },
  });

  return NextResponse.json({
    ingresos: ingresos._sum.monto ?? 0,
    pagosPendientes,
    alertasNoLeidas,
    desde: since,
  });
}

