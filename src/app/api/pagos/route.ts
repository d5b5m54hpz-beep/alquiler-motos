import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/authz";

export async function GET() {
  const { error, role, userId } = await requireRole(["admin", "operador", "cliente"]);
  if (error) return error;

  if (role === "cliente") {
    const cliente = await prisma.cliente.findUnique({ where: { userId: userId! } });
    if (!cliente) return Response.json([]);
    const pagos = await prisma.pago.findMany({
      where: { contrato: { clienteId: cliente.id } },
      include: {
        contrato: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return Response.json(pagos);
  }

  const pagos = await prisma.pago.findMany({
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
  const { error } = await requireRole(["admin", "operador"]);
  if (error) return error;

  const body = await req.json();
  const { contratoId, monto, metodo, referencia } = body ?? {};

  if (!contratoId || !monto || !metodo) {
    return new Response(
      JSON.stringify({ error: "Faltan datos obligatorios" }),
      { status: 400 }
    );
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
