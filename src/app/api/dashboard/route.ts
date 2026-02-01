import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const totalMotos = await prisma.moto.count();
    const totalContratos = await prisma.contrato.count();
    const totalClientes = await prisma.cliente.count();
    const pagosPendientes = await prisma.pago.count({ where: { estado: { not: "pagado" } } });
    const alertasNoLeidas = await prisma.alerta.count({ where: { leida: false } });

    return Response.json({
      totalMotos,
      totalContratos,
      totalClientes,
      pagosPendientes,
      alertasNoLeidas,
    });
  } catch (error) {
    console.error(error);
    return new Response("Error fetching dashboard KPIs", { status: 500 });
  }
}
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const days = Number(searchParams.get("days") ?? 30);

  const desde = new Date();
  desde.setDate(desde.getDate() - days);

  const [
    totalCobrado,
    pagosPendientes,
    pagosVencidos,
    facturasEmitidas,
    alertasNoLeidas,
  ] = await Promise.all([
    prisma.pago.aggregate({
      where: {
        estado: "pagado",
        pagadoAt: { gte: desde },
      },
      _sum: { monto: true },
    }),
    prisma.pago.count({
      where: {
        estado: "pendiente",
        createdAt: { gte: desde },
      },
    }),
    prisma.pago.count({
      where: {
        estado: "vencido",
        createdAt: { gte: desde },
      },
    }),
    prisma.factura.count({
      where: {
        emitidaAt: { gte: desde },
      },
    }),
    prisma.alerta.count({
      where: {
        leida: false,
        createdAt: { gte: desde },
      },
    }),
  ]);

  return Response.json({
    totalCobrado: totalCobrado._sum.monto ?? 0,
    pagosPendientes,
    pagosVencidos,
    facturasEmitidas,
    alertasNoLeidas,
  });
}
