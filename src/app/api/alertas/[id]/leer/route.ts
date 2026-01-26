import { prisma } from "@/lib/prisma";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const alerta = await prisma.alerta.findUnique({
    where: { id },
  });

  if (!alerta) {
    return Response.json(
      { error: "Alerta no encontrada" },
      { status: 404 }
    );
  }

  const actualizada = await prisma.alerta.update({
    where: { id },
    data: { leida: true },
  });

  return Response.json(actualizada);
}
