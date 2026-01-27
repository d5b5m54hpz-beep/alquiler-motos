import { prisma } from "@/lib/prisma";

/**
 * GET /api/verificaciones/alertas-riesgo
 * Listar alertas de alto riesgo de validaciones DNI
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limite = parseInt(searchParams.get("limite") || "50");
    const riesgo = searchParams.get("riesgo") || "HIGH"; // HIGH, MEDIUM, ALL

    const alertas = await prisma.alerta.findMany({
      where: {
        tipo: "VERIFICACION_DNI",
        ...(riesgo !== "ALL" && {
          dniVerificacion: {
            path: ["riesgoNivel"],
            equals: riesgo,
          },
        }),
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
    });

    const alertasRiesgo = alertas.map((alerta) => {
      const dni = alerta.dniVerificacion as any;
      return {
        id: alerta.id,
        dni: dni?.dni,
        nombre: dni?.nombre,
        riesgoNivel: dni?.riesgoNivel,
        verificado: dni?.verificado,
        razon: dni?.razonRechazo,
        createdAt: alerta.createdAt,
        leida: alerta.leida,
      };
    });

    return Response.json({
      data: alertasRiesgo,
      total: alertasRiesgo.length,
      filtroRiesgo: riesgo,
    });
  } catch (error) {
    console.error("Error obteniendo alertas de riesgo:", error);
    return Response.json(
      { error: "Error obteniendo alertas de riesgo" },
      { status: 500 }
    );
  }
}
