// Endpoint público sin autenticación para Retool
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const motos = await prisma.moto.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        marca: true,
        modelo: true,
        patente: true,
        anio: true,
        estado: true,
        createdAt: true,
        _count: {
          select: { contratos: true },
        },
      },
    });
    return Response.json(motos);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Error fetching motos" }, { status: 500 });
  }
}
