import { prisma } from "@/lib/prisma";

export async function GET() {
  const pagos = await prisma.pago.findMany({
    where: {
      estado: "pagado",
      pagadoAt: { not: null },
    },
  });

  const porMes: Record<string, number> = {};

  for (const p of pagos) {
    const d = new Date(p.pagadoAt!);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    porMes[key] = (porMes[key] || 0) + p.monto;
  }

  const data = Object.entries(porMes)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([mes, total]) => ({ mes, total }));

  return Response.json(data);
}
