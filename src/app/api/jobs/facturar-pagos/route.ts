import { prisma } from "@/lib/prisma";

export async function POST() {
  const pagos = await prisma.pago.findMany({
    where: {
      estado: "pagado",
      factura: null,
    },
  });

  let creadas = 0;

  for (const pago of pagos) {
    const numero = `F-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    await prisma.factura.create({
      data: {
        contratoId: pago.contratoId,
        pagoId: pago.id,
        numero,
        monto: pago.monto,
        estado: "emitida",
        emitidaAt: new Date(),
      },
    });

    await prisma.alerta.create({
      data: {
        tipo: "factura_emitida",
        mensaje: `Factura ${numero} emitida por pago ${pago.id}`,
        contratoId: pago.contratoId,
        pagoId: pago.id,
      },
    });

    creadas++;
  }

  return Response.json({
    ok: true,
    pagosProcesados: pagos.length,
    facturasCreadas: creadas,
  });
}
