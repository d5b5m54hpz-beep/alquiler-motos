import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET() {
  try {
    const clientes = await prisma.cliente.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { contratos: true },
        },
      },
    });
    return Response.json(clientes);
  } catch (error) {
    console.error(error);
    return new Response("Error fetching clientes", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nombre, dni, telefono, email } = body;

    if (!nombre || !dni) {
      return new Response("Nombre y DNI son requeridos", { status: 400 });
    }

    const cliente = await prisma.cliente.create({
      data: { nombre, dni, telefono, email },
    });

    return Response.json(cliente);
  } catch (error: any) {
    console.error(error);
    if (error.code === "P2002") {
      return new Response("DNI ya existe", { status: 400 });
    }
    return new Response("Error creating cliente", { status: 500 });
  }
}
