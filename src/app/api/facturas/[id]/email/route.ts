import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const factura = await prisma.factura.findUnique({
    where: { id },
    include: {
      contrato: {
        include: {
          cliente: true,
        },
      },
    },
  });

  if (!factura) {
    return NextResponse.json(
      { error: "Factura no encontrada" },
      { status: 404 }
    );
  }

  if (factura.emailEnviado) {
    return NextResponse.json(
      { error: "Email ya enviado" },
      { status: 400 }
    );
  }

  // SIMULACIÓN DE EMAIL
  console.log("📧 Enviando email de factura");
  console.log("Para:", factura.contrato.cliente.email);
  console.log("Factura:", factura.numero);
  console.log("Monto:", factura.monto);

  const actualizada = await prisma.factura.update({
    where: { id: factura.id },
    data: {
      emailEnviado: true,
      emailAt: new Date(),
    },
  });

  await prisma.alerta.create({
    data: {
      tipo: "factura_email",
      mensaje: `Factura ${factura.numero} enviada por email`,
      contratoId: factura.contratoId,
      pagoId: factura.pagoId,
    },
  });

  return NextResponse.json(actualizada);
}
