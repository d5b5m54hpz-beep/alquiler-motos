import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { requireRole } from "@/lib/authz";

export async function GET() {
  try {
    const { error, role, userId } = await requireRole(["admin", "operador", "cliente"]);
    if (error) return error;

    if (role === "cliente") {
      const cliente = await prisma.cliente.findUnique({
        where: { userId: userId! },
        include: {
          _count: { select: { contratos: true } },
        },
      });
      return Response.json(cliente ? [cliente] : []);
    }

    const clientes = await prisma.cliente.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { contratos: true },
        },
      },
    });
    return Response.json(clientes);
  } catch (error: unknown) {
    console.error(error);
    return Response.json({ error: "Error fetching clientes" }, { status: 500 });
  }
}

export async function POST() {
  return Response.json({ error: "Metodo no permitido" }, { status: 405 });
}
