import { prisma } from "@/lib/prisma";

export async function POST() {
  // Marcar el primer pago pendiente como pagado
  const pago = await prisma.pago.findFirst({
    where: { estado: "pendiente" },
  });

  if (!pago) {
    return Response.json(
      { error: "No hay pagos pendientes" },
      { status: 404 }
    );
  }

  await prisma.pago.update({
    where: { id: pago.id },
    data: { estado: "pagado", pagadoAt: new Date() },
  });

  return Response.json({
    ok: true,
    mensaje: "Pago marcado como pagado",
    pagoId: pago.id,
  });
}
