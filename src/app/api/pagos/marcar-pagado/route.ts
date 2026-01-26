import { prisma } from "@/lib/prisma";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const pagoId = id;

  const pago = await prisma.pago.findUnique({
    where: { id: pagoId },
  });

  if (!pago) {
    return new Response(
      JSON.stringify({ error: "Pago no existe" }),
      { status: 404 }
    );
  }

  if (pago.estado === "pagado") {
    return new Response(
      JSON.stringify({ error: "El pago ya está marcado como pagado" }),
      { status: 400 }
    );
  }

  const actualizado = await prisma.pago.update({
    where: { id: pagoId },
    data: {
      estado: "pagado",
      pagadoAt: new Date(),
    },
  });

  return Response.json(actualizado);
}
