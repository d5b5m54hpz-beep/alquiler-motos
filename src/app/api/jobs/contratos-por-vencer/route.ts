import { prisma } from "@/lib/prisma";

export async function POST() {
  const hoy = new Date();
  const diasAviso = 3;

  const limite = new Date();
  limite.setDate(hoy.getDate() + diasAviso);

  const contratos = await prisma.contrato.findMany({
    where: {
      estado: "activo",
      fechaFin: {
        gte: hoy,
        lte: limite,
      },
    },
  });

  let creadas = 0;

  for (const contrato of contratos) {
    const existe = await prisma.alerta.findFirst({
      where: {
        tipo: "contrato_por_vencer",
        contratoId: contrato.id,
        leida: false,
      },
    });

    if (existe) continue;

    await prisma.alerta.create({
      data: {
        tipo: "contrato_por_vencer",
        mensaje: `El contrato ${contrato.id} vence el ${contrato.fechaFin.toLocaleDateString()}`,
        contratoId: contrato.id,
      },
    });

    creadas++;
  }

  return Response.json({
    ok: true,
    contratosRevisados: contratos.length,
    alertasCreadas: creadas,
  });
}
