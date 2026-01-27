import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { requireRole } from "@/lib/authz";

export async function POST() {
  const { error } = await requireRole(["admin"]);
  if (error) return error;

  const ahora = new Date();

  const pagos = await prisma.pago.findMany({
    where: {
      estado: "pendiente",
      vencimientoAt: {
        lt: ahora,
      },
    },
    include: {
      contrato: {
        include: {
          cliente: true,
          moto: true,
        },
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

    const cliente = pago.contrato?.cliente;
    if (cliente?.email) {
      await sendEmail(
        cliente.email,
        "Pago vencido",
        `<p>Tu pago #${pago.id} está vencido.</p>`
      );
    }

    marcados++;
  }

  return Response.json({
    ok: true,
    pagosRevisados: pagos.length,
    pagosMarcados: marcados,
    ejecutadoAt: ahora,
  });
}
