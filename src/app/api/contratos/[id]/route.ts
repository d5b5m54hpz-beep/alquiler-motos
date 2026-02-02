import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const contrato = await prisma.contrato.findUnique({
      where: { id },
      include: {
        cliente: true,
        moto: true,
        pagos: true,
      },
    });
    if (!contrato) {
      return Response.json({ error: "Contrato no encontrado" }, { status: 404 });
    }
    return Response.json(contrato);
  } catch (error: unknown) {
    console.error(error);
    return Response.json({ error: "Error fetching contrato" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await req.json();
    const { clienteId, motoId, fechaInicio, fechaFin, precioSemana, estado } = body;

    const contrato = await prisma.contrato.update({
      where: { id },
      data: {
        clienteId,
        motoId,
        fechaInicio: fechaInicio ? new Date(fechaInicio) : undefined,
        fechaFin: fechaFin ? new Date(fechaFin) : undefined,
        precioSemana: precioSemana ? Number(precioSemana) : undefined,
        estado,
      },
      include: {
        cliente: true,
        moto: true,
      },
    });

    return Response.json(contrato);
  } catch (error: unknown) {
    console.error(error);
    return Response.json({ error: "Error updating contrato" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.contrato.delete({ where: { id } });
    return Response.json({ ok: true });
  } catch (error: unknown) {
    console.error(error);
    return Response.json({ error: "Error deleting contrato" }, { status: 500 });
  }
}
