import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/authz";

export async function GET() {
  const { error, role, userId } = await requireRole(["admin", "operador", "cliente"]);
  if (error) return error;

  if (role === "cliente") {
    const cliente = await prisma.cliente.findUnique({ where: { userId: userId! } });
    if (!cliente) return Response.json([]);
    const alertas = await prisma.alerta.findMany({
      where: { contrato: { clienteId: cliente.id } },
      orderBy: { createdAt: "desc" },
    });
    return Response.json(alertas);
  }

  const alertas = await prisma.alerta.findMany({
    orderBy: { createdAt: "desc" },
  });

  return Response.json(alertas);
}
