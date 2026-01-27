import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/authz";

export async function GET(req: Request) {
  const authError = await requireRole(["admin", "auditor"], req);
  if (authError) return authError;

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
