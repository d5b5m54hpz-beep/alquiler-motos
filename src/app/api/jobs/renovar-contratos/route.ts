import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const ahora = new Date();

    const contratosAVencer = await prisma.contrato.findMany({
      where: {
        estado: "activo",
        fechaFin: {
          lte: ahora,
        },
      },
    });

    for (const contrato of contratosAVencer) {
      await prisma.contrato.update({
        where: { id: contrato.id },
        data: {
          estado: "vencido",
        },
      });
    }

    return Response.json({
      ok: true,
      renovados: contratosAVencer.length,
    });
  } catch (error) {
    console.error("Error en renovar contratos:", error);
    return Response.json({ ok: false, error: String(error) }, { status: 500 });
  }
}
