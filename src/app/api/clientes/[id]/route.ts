import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const cliente = await prisma.cliente.findUnique({
      where: { id },
      include: { contratos: true },
    });
    if (!cliente) {
      return new Response("Cliente no encontrado", { status: 404 });
    }
    return Response.json(cliente);
  } catch (error) {
    console.error(error);
    return new Response("Error fetching cliente", { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await req.json();
    const { nombre, dni, telefono, email } = body;

    const cliente = await prisma.cliente.update({
      where: { id },
      data: { nombre, dni, telefono, email },
    });

    return Response.json(cliente);
  } catch (error: any) {
    console.error(error);
    if (error.code === "P2002") {
      return new Response("DNI ya existe", { status: 400 });
    }
    return new Response("Error updating cliente", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.cliente.delete({ where: { id } });
    return Response.json({ ok: true });
  } catch (error) {
    console.error(error);
    return new Response("Error deleting cliente", { status: 500 });
  }
}
