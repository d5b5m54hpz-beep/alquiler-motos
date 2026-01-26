import { prisma } from "@/lib/prisma";

export async function POST() {
  const ahora = new Date();

  const pagos = await prisma.pago.findMany({
    where: {
      estado: "pendiente",
      vencimientoAt: {
        lt: ahora,
      },
    },
  });

  let marcados = 0;

  for (const pago of pagos) {
    await prisma.pago.update({
      where: { id: pago.id },
      data: { estado: "vencido" },
    });

    await prisma.alerta.create({
      data: {
        tipo: "pago_vencido",
        mensaje: `El pago ${pago.id} se encuentra vencido`,
        contratoId: pago.contratoId,
        pagoId: pago.id,
      },
    });

    marcados++;
  }

  return Response.json({
    ok: true,
    pagosRevisados: pagos.length,
    pagosMarcados: marcados,
    ejecutadoAt: ahora,
  });
}
