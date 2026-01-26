import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/authz";

export async function GET() {
  await requireRole(["admin", "operador", "auditor"]);

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
  await requireRole(["admin", "operador"]);

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
