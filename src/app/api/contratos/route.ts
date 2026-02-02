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
  } catch (error: unknown) {
    console.error(error);
    return Response.json({ error: "Error fetching contratos" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { error, role, userId } = await requireRole(["admin", "operador", "cliente"]);
    if (error) return error;

    const body = await req.json();
    const {
      clienteId,
      motoId,
      fechaInicio,
      fechaFin,
      precioSemana,
      estado,
      duracionMeses,
      tipoPago,
      precioMensual,
      precioSemanal,
      descuentoDuracion,
      descuentoSemanal
    } = body;

    // Si es cliente, usar su propio clienteId
    let finalClienteId = clienteId;
    if (role === "cliente") {
      const cliente = await prisma.cliente.findUnique({ where: { userId: userId! } });
      if (!cliente) {
        return Response.json({ error: "Cliente no encontrado" }, { status: 404 });
      }
      finalClienteId = cliente.id;
    }

    if (!finalClienteId || !motoId || !fechaInicio || !fechaFin || precioSemana === undefined) {
      return Response.json({ error: "Campos requeridos faltantes" }, { status: 400 });
    }

    const contrato = await prisma.contrato.create({
      data: {
        clienteId: finalClienteId,
        motoId,
        fechaInicio: new Date(fechaInicio),
        fechaFin: new Date(fechaFin),
        precioSemana: Number(precioSemana),
        estado: estado || "pendiente",
        duracionMeses: duracionMeses ? Number(duracionMeses) : null,
        tipoPago,
        precioMensual: precioMensual ? Number(precioMensual) : null,
        precioSemanal: precioSemanal ? Number(precioSemanal) : null,
        descuentoDuracion: descuentoDuracion ? Number(descuentoDuracion) : null,
        descuentoSemanal: descuentoSemanal ? Number(descuentoSemanal) : null,
      },
      include: {
        cliente: true,
        moto: true,
      },
    });

    return Response.json(contrato);
  } catch (error: unknown) {
    console.error(error);
    return Response.json({ error: "Error creating contrato" }, { status: 500 });
  }
}
