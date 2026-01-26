import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const moto = await prisma.moto.findUnique({
      where: { id },
      include: { contratos: true },
    });
    if (!moto) {
      return new Response("Moto no encontrada", { status: 404 });
    }
    return Response.json(moto);
  } catch (error) {
    console.error(error);
    return new Response("Error fetching moto", { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await req.json();
    const { marca, modelo, patente, anio, estado } = body;

    const moto = await prisma.moto.update({
      where: { id },
      data: { marca, modelo, patente, anio: anio ? Number(anio) : undefined, estado },
    });

    return Response.json(moto);
  } catch (error: any) {
    console.error(error);
    if (error.code === "P2002") {
      return new Response("Patente ya existe", { status: 400 });
    }
    return new Response("Error updating moto", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.moto.delete({ where: { id } });
    return Response.json({ ok: true });
  } catch (error) {
    console.error(error);
    return new Response("Error deleting moto", { status: 500 });
  }
}
