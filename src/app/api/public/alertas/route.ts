// Endpoint público sin autenticación para Retool
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const alertas = await prisma.alerta.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        tipo: true,
        mensaje: true,
        leida: true,
        contratoId: true,
        createdAt: true,
      },
    });
    return Response.json(alertas);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Error fetching alertas" }, { status: 500 });
  }
}
