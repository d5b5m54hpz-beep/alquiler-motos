import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/authz";

export async function GET(req: Request) {
  const authError = await requireRole(["admin", "operador", "auditor"], req);
  if (authError) return authError;

  const alertas = await prisma.alerta.findMany({
    orderBy: { createdAt: "desc" },
  });

  return Response.json(alertas);
}
