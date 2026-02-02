import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { requireRole } from "@/lib/authz";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const { error, role, userId } = await requireRole(["admin", "operador", "cliente"]);
    if (error) return error;

    if (role === "cliente") {
      const own = await prisma.cliente.findUnique({ where: { userId: userId! } });
      if (!own || own.id !== id) {
        return Response.json({ error: "FORBIDDEN" }, { status: 403 });
      }
    }

    const cliente = await prisma.cliente.findUnique({
      where: { id },
      include: { contratos: true },
    });
    if (!cliente) {
      return Response.json({ error: "Cliente no encontrado" }, { status: 404 });
    }
    return Response.json(cliente);
  } catch (error: unknown) {
    console.error(error);
    return Response.json({ error: "Error fetching cliente" }, { status: 500 });
  }
}

export async function PUT() {
  return Response.json({ error: "Metodo no permitido" }, { status: 405 });
}

export async function DELETE() {
  return Response.json({ error: "Metodo no permitido" }, { status: 405 });
}
