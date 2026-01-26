import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/authz";

export async function GET() {
  await requireRole(["admin", "auditor"]);

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
