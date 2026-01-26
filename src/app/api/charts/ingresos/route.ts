import { prisma } from "@/lib/prisma";

export async function GET() {
  const pagos = await prisma.pago.findMany({
    where: { estado: "pagado" },
    include: {
      contrato: {
        include: {
          cliente: true,
          moto: true,
        },
      },
    },
  });

  const porCliente: Record<string, number> = {};
  const porMoto: Record<string, number> = {};

  for (const p of pagos) {
    const cliente = p.contrato.cliente.nombre;
    const moto = `${p.contrato.moto.marca} ${p.contrato.moto.modelo}`;

    porCliente[cliente] = (porCliente[cliente] || 0) + p.monto;
    porMoto[moto] = (porMoto[moto] || 0) + p.monto;
  }

  return Response.json({
    clientes: Object.entries(porCliente).map(([name, total]) => ({
      name,
      total,
    })),
    motos: Object.entries(porMoto).map(([name, total]) => ({
      name,
      total,
    })),
  });
}
