import { prisma } from "@/lib/prisma";

export async function GET() {
  const count = await prisma.alerta.count({
    where: { leida: false },
  });

  return Response.json({ count });
}
