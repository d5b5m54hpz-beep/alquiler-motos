import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { pagoId, metodo } = await req.json();

  if (!pagoId) {
    return new Response(
      JSON.stringify({ error: "ID de pago requerido" }),
      { status: 400 }
    );
  }

  const pago = await prisma.pago.findUnique({
    where: { id: pagoId },
  });

  if (!pago) {
    return new Response(
      JSON.stringify({ error: "Pago no encontrado" }),
      { status: 404 }
    );
  }

  if (pago.estado === "pagado") {
    return new Response(
      JSON.stringify({ error: "El pago ya está confirmado" }),
      { status: 400 }
    );
  }

  // Confirmar el pago
  const pagoActualizado = await prisma.pago.update({
    where: { id: pagoId },
    data: {
      estado: "pagado",
      pagadoAt: new Date(),
    },
  });

  // Actualizar el estado del contrato a "activo"
  await prisma.contrato.update({
    where: { id: pago.contratoId },
    data: {
      estado: "activo",
    },
  });

  return Response.json(pagoActualizado);
}