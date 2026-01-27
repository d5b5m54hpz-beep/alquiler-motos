import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { requireRole } from "@/lib/authz";

export async function GET() {
  try {
    const { error, role, userId } = await requireRole(["admin", "operador", "cliente"]);
    if (error) return error;

    if (role === "cliente") {
      const cliente = await prisma.cliente.findUnique({ where: { userId: userId! } });
      if (!cliente) return Response.json([]);
      const contratos = await prisma.contrato.findMany({
        where: { clienteId: cliente.id },
        orderBy: { createdAt: "desc" },
        include: {
          cliente: true,
          moto: true,
          _count: {
            select: { pagos: true },
          },
        },
      });
      return Response.json(contratos);
    }

    const contratos = await prisma.contrato.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        cliente: true,
        moto: true,
        _count: {
          select: { pagos: true },
        },
      },
    });
    return Response.json(contratos);
  } catch (error) {
    console.error(error);
    return new Response("Error fetching contratos", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { error, role } = await requireRole(["admin", "operador"]);
    if (error) return error;

    const body = await req.json();
    const { clienteId, motoId, fechaInicio, fechaFin, precioSemana, estado } = body;

    if (!clienteId || !motoId || !fechaInicio || !fechaFin || !precioSemana) {
      return new Response("Todos los campos son requeridos", { status: 400 });
    }

    const contrato = await prisma.contrato.create({
      data: {
        clienteId,
        motoId,
        fechaInicio: new Date(fechaInicio),
        fechaFin: new Date(fechaFin),
        precioSemana: Number(precioSemana),
        estado: estado || "activo",
      },
      include: {
        cliente: true,
        moto: true,
      },
    });

    return Response.json(contrato);
  } catch (error) {
    console.error(error);
    return new Response("Error creating contrato", { status: 500 });
  }
}
