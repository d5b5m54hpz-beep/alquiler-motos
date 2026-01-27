import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/authz";

export async function GET() {
  const { error, role, userId } = await requireRole(["admin", "operador", "cliente"]);
  if (error) return error;

  if (role === "cliente") {
    const cliente = await prisma.cliente.findUnique({ where: { userId: userId! } });
    if (!cliente) return Response.json([]);
    const facturas = await prisma.factura.findMany({
      where: { contrato: { clienteId: cliente.id } },
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
