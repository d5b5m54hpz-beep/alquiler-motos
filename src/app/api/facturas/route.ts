import { prisma } from "@/lib/prisma";

export async function GET() {
  const facturas = await prisma.factura.findMany({
    include: {
      contrato: {
        include: {
          cliente: true,
          moto: true,
        },
      },
      pago: true,
    },
    orderBy: { emitidaAt: "desc" },
  });

  return Response.json(facturas);
}
