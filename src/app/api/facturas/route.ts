import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/authz";

export async function GET() {
  const { error, role, userId } = await requireRole(["admin", "operador", "cliente"]);
  if (error) return error;

  if (role === "cliente") {
    const cliente = await prisma.cliente.findUnique({ where: { userId: userId! } });
    if (!cliente) return Response.json([]);
    const facturas = await prisma.factura.findMany({
      where: { contrato: { clienteId: cliente.id } },
      include: {
        contrato: {
          include: {
            cliente: true,
            moto: true,
          },
        },
        pago: true,
      },
      orderBy: { emitidaAt: "desc" },
    });
    return Response.json(facturas);
  }

  const facturas = await prisma.factura.findMany({
    include: {
      contrato: {
        include: {
          cliente: true,
          moto: true,
        },
      },
      pago: true,
    },
    orderBy: { emitidaAt: "desc" },
  });

  return Response.json(facturas);
}

export async function POST(req: Request) {
  const { error, role, userId } = await requireRole(["admin", "operador", "cliente"]);
  if (error) return error;

  const { pagoId } = await req.json();

  if (!pagoId) {
    return new Response(
      JSON.stringify({ error: "ID de pago requerido" }),
      { status: 400 }
    );
  }

  // Verificar que el pago existe y está pagado
  const pago = await prisma.pago.findUnique({
    where: { id: pagoId },
    include: {
      contrato: {
        include: {
          cliente: true,
          moto: true,
        },
      },
    },
  });

  if (!pago) {
    return new Response(
      JSON.stringify({ error: "Pago no encontrado" }),
      { status: 404 }
    );
  }

  if (pago.estado !== "pagado") {
    return new Response(
      JSON.stringify({ error: "El pago debe estar confirmado para generar factura" }),
      { status: 400 }
    );
  }

  // Verificar que no existe ya una factura para este pago
  const facturaExistente = await prisma.factura.findUnique({
    where: { pagoId },
  });

  if (facturaExistente) {
    return Response.json(facturaExistente);
  }

  // Generar número de factura (simple para demo)
  const fecha = new Date();
  const numeroFactura = `F${fecha.getFullYear()}${String(fecha.getMonth() + 1).padStart(2, '0')}${String(fecha.getDate()).padStart(2, '0')}${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;

  // Crear factura
  const factura = await prisma.factura.create({
    data: {
      contratoId: pago.contratoId,
      pagoId: pago.id,
      numero: numeroFactura,
      monto: pago.monto,
      estado: "emitida",
      emitidaAt: new Date(),
    },
  });

  // Enviar email con la factura (simulado)
  try {
    await enviarFacturaPorEmail(factura, pago);
  } catch (emailError) {
    console.error("Error enviando email:", emailError);
    // No fallar la creación de factura por error de email
  }

  return Response.json(factura, { status: 201 });
}

// Función para enviar factura por email (simulada)
async function enviarFacturaPorEmail(factura: any, pago: any) {
  // En un entorno real, aquí usarías un servicio de email como SendGrid, Mailgun, etc.
  console.log(`📧 Enviando factura ${factura.numero} a ${pago.contrato.cliente.email}`);

  // Marcar como enviado
  await prisma.factura.update({
    where: { id: factura.id },
    data: {
      emailEnviado: true,
      emailAt: new Date(),
    },
  });

  // Simular envío exitoso
  return true;
}
