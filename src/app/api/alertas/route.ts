import { prisma } from "@/lib/prisma";
// import { requireRole } from "@/lib/authz";

export async function GET() {
  // const { error, role, userId } = await requireRole(["admin", "operador", "cliente"]);
  // if (error) return error;

  const alertas = await prisma.alerta.findMany({
    orderBy: { createdAt: "desc" },
  });

  return Response.json(alertas);
}
