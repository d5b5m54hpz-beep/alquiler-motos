import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const days = Number(searchParams.get("days") ?? 30);

  const desde = new Date();
  desde.setDate(desde.getDate() - days);

  const pagosPagados = await prisma.pago.findMany({
    where: {
      estado: "pagado",
      pagadoAt: { gte: desde },
    },
    select: {
      monto: true,
      pagadoAt: true,
    },
  });

  const ingresosPorDia: Record<string, number> = {};

  for (const p of pagosPagados) {
    if (!p.pagadoAt) continue;
    const dia = p.pagadoAt.toISOString().slice(0, 10);
    ingresosPorDia[dia] = (ingresosPorDia[dia] || 0) + p.monto;
  }

  const ingresos = Object.entries(ingresosPorDia).map(([fecha, total]) => ({
    fecha,
    total,
  }));

  const pagosPorEstado = await prisma.pago.groupBy({
    by: ["estado"],
    where: {
      createdAt: { gte: desde },
    },
    _count: { estado: true },
  });

  const estados = pagosPorEstado.map((p) => ({
    estado: p.estado,
    cantidad: p._count.estado,
  }));

  return Response.json({
    ingresos,
    estados,
  });
}
