import { prisma } from "@/lib/prisma";

/**
 * GET /api/verificaciones/reportes
 * Reporte de validaciones DNI con estadísticas
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const diasAtras = parseInt(searchParams.get("dias") || "30");
    const ahora = new Date();
    const fechaInicio = new Date(ahora.getTime() - diasAtras * 24 * 60 * 60 * 1000);

    // Obtener todas las verificaciones en el rango
    const verificaciones = await prisma.alerta.findMany({
      where: {
        tipo: "VERIFICACION_DNI",
        createdAt: {
          gte: fechaInicio,
          lte: ahora,
        },
      },
      select: {
        dniVerificacion: true,
        createdAt: true,
      },
    });

    // Procesar estadísticas
    const estadisticas = {
      total: verificaciones.length,
      verificadas: 0,
      rechazadas: 0,
      porRiesgo: {
        LOW: 0,
        MEDIUM: 0,
        HIGH: 0,
      },
      porDia: {} as Record<string, number>,
    };

    verificaciones.forEach((v) => {
      const dni = v.dniVerificacion as any;
      if (!dni) return;

      if (dni.verificado) {
        estadisticas.verificadas++;
      } else {
        estadisticas.rechazadas++;
      }

      estadisticas.porRiesgo[dni.riesgoNivel]++;

      const fecha = v.createdAt.toISOString().split("T")[0];
      estadisticas.porDia[fecha] = (estadisticas.porDia[fecha] || 0) + 1;
    });

    // Calcular tasa de éxito
    const tasaExito =
      estadisticas.total > 0
        ? ((estadisticas.verificadas / estadisticas.total) * 100).toFixed(2)
        : "0.00";

    return Response.json({
      periodo: {
        desde: fechaInicio.toISOString().split("T")[0],
        hasta: ahora.toISOString().split("T")[0],
        dias: diasAtras,
      },
      estadisticas,
      tasaExito: `${tasaExito}%`,
      resumenRiesgo: {
        bajo: `${((estadisticas.porRiesgo.LOW / estadisticas.total) * 100).toFixed(2)}%`,
        medio: `${((estadisticas.porRiesgo.MEDIUM / estadisticas.total) * 100).toFixed(2)}%`,
        alto: `${((estadisticas.porRiesgo.HIGH / estadisticas.total) * 100).toFixed(2)}%`,
      },
    });
  } catch (error) {
    console.error("Error generando reporte:", error);
    return Response.json(
      { error: "Error generando reporte" },
      { status: 500 }
    );
  }
}
