const { PrismaClient } = require('@prisma/client');

(async () => {
  const prisma = new PrismaClient();
  const pagoId = 'cmkv5ep4l0001nyv4kq2ivhbu';
  const emailDestino = 'dantebustos@icloud.com';

  try {
    const pago = await prisma.pago.findUnique({ where: { id: pagoId } });
    if (!pago) throw new Error('Pago no encontrado');

    const pagoActualizado = await prisma.pago.update({
      where: { id: pagoId },
      data: { estado: 'pagado', pagadoAt: new Date() },
    });

    let factura = await prisma.factura.findFirst({ where: { pagoId } });

    if (!factura) {
      const numero = `F-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      factura = await prisma.factura.create({
        data: {
          contratoId: pago.contratoId,
          pagoId: pago.id,
          numero,
          monto: pago.monto,
          estado: 'emitida',
          emitidaAt: new Date(),
        },
      });

      await prisma.alerta.create({
        data: {
          tipo: 'factura_emitida',
          mensaje: `Factura ${numero} emitida por pago ${pago.id}`,
          contratoId: pago.contratoId,
          pagoId: pago.id,
        },
      });
    }

    const facturaConEmail = await prisma.factura.update({
      where: { id: factura.id },
      data: {
        emailEnviado: true,
        emailAt: new Date(),
      },
    });

    await prisma.alerta.create({
      data: {
        tipo: 'factura_email',
        mensaje: `Factura ${factura.numero} enviada por email a ${emailDestino}`,
        contratoId: factura.contratoId,
        pagoId: factura.pagoId,
      },
    });

    console.log('Pago marcado como pagado y factura procesada.');
    console.log({ pagoActualizado, factura: facturaConEmail, emailDestino });
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
})();
