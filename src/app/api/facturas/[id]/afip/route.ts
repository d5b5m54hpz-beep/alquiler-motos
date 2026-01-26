import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {

    // Obtener factura
    const factura = await prisma.factura.findUnique({
      where: { id },
      include: { pago: true },
    });

    if (!factura) {
      return NextResponse.json(
        { error: 'Factura no encontrada' },
        { status: 404 }
      );
    }

    if ((factura as any).afipEstado === 'enviado') {
      return NextResponse.json(
        { error: 'Factura ya enviada a AFIP' },
        { status: 400 }
      );
    }

    // Simular generación de CAE (14 dígitos)
    const cae = Math.random().toString().substring(2, 16).padStart(14, '0');

    // Calcular vencimiento CAE (60 días desde hoy)
    const caeVto = new Date();
    caeVto.setDate(caeVto.getDate() + 60);

    // Actualizar factura con datos AFIP
    const facturaActualizada = await prisma.factura.update({
      where: { id },
      data: {
        afipEstado: 'enviado',
        cae,
        caeVto,
      } as any,
    });

    // Crear alerta fiscal
    await prisma.alerta.create({
      data: {
        tipo: 'factura_afip',
        mensaje: `Factura #${factura.numero} enviada a AFIP. CAE: ${cae}`,
        pagoId: factura.pagoId,
      },
    });

    return NextResponse.json({
      afipEstado: (facturaActualizada as any).afipEstado,
      cae: (facturaActualizada as any).cae,
      caeVto: (facturaActualizada as any).caeVto,
    });
  } catch (error) {
    console.error('Error en AFIP:', error);
    return NextResponse.json(
      { error: 'Error procesando AFIP' },
      { status: 500 }
    );
  }
}
