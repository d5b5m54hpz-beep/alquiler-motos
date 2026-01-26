import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/authz";

export async function GET() {
  await requireRole(["admin", "operador", "auditor"]);

  const alertas = await prisma.alerta.findMany({
    orderBy: { createdAt: "desc" },
  });

  return Response.json(alertas);
}
