import { prisma } from "@/lib/prisma";

/**
 * GET /api/verificaciones/historial
 * Listar todo el historial de validaciones DNI
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limite = parseInt(searchParams.get("limite") || "50");
    const pagina = parseInt(searchParams.get("pagina") || "1");
    const skip = (pagina - 1) * limite;

    const verificaciones = await prisma.alerta.findMany({
      where: {
        tipo: "VERIFICACION_DNI",
      },
      select: {
        id: true,
        mensaje: true,
        dniVerificacion: true,
        createdAt: true,
        leida: true,
      },
      orderBy: { createdAt: "desc" },
      take: limite,
      skip,
    });

    const total = await prisma.alerta.count({
      where: { tipo: "VERIFICACION_DNI" },
    });

    return Response.json({
      data: verificaciones,
      total,
      pagina,
      limite,
      totalPaginas: Math.ceil(total / limite),
    });
  } catch (error: unknown) {
    console.error("Error obteniendo historial:", error);
    return Response.json(
      { error: "Error obteniendo historial" },
      { status: 500 }
    );
  }
}
