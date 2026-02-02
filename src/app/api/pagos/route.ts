import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/authz";

export async function GET(req: Request) {
  const { error, role, userId } = await requireRole(["admin", "operador", "cliente"]);
  if (error) return error;

  const url = new URL(req.url);
  const contratoId = url.searchParams.get("contratoId");

  let whereClause: any = {};

  if (contratoId) {
    whereClause.contratoId = contratoId;
  } else if (role === "cliente") {
    const cliente = await prisma.cliente.findUnique({ where: { userId: userId! } });
    if (!cliente) return Response.json([]);
    whereClause.contrato = { clienteId: cliente.id };
  }

  const pagos = await prisma.pago.findMany({
    where: whereClause,
    include: {
      contrato: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return Response.json(pagos);
}

export async function POST(req: Request) {
  const { error, role, userId } = await requireRole(["admin", "operador", "cliente"]);
  if (error) return error;

  const body = await req.json();
  const { contratoId, monto, metodo, referencia } = body ?? {};

  if (!contratoId || !monto || !metodo) {
    return new Response(
      JSON.stringify({ error: "Faltan datos obligatorios" }),
      { status: 400 }
    );
  }

  // Verificar que el cliente solo pueda crear pagos para sus propios contratos
  if (role === "cliente") {
    const cliente = await prisma.cliente.findUnique({ where: { userId: userId! } });
    if (!cliente) {
      return new Response(
        JSON.stringify({ error: "Cliente no encontrado" }),
        { status: 404 }
      );
    }

    const contrato = await prisma.contrato.findUnique({
      where: { id: contratoId },
      select: { clienteId: true }
    });

    if (!contrato || contrato.clienteId !== cliente.id) {
      return new Response(
        JSON.stringify({ error: "No autorizado para crear pago en este contrato" }),
        { status: 403 }
      );
    }
  }

  const pago = await prisma.pago.create({
    data: {
      contratoId,
      monto: Number(monto),
      metodo,
      estado: "pendiente",
      referencia: referencia || null,
    },
  });

  return Response.json(pago, { status: 201 });
}
