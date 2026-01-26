import { prisma } from "@/lib/prisma";

export async function GET() {
  const alertas = await prisma.alerta.findMany({
    orderBy: { createdAt: "desc" },
  });

  return Response.json(alertas);
}
