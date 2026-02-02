import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { afip } from '@/lib/afip';

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

    if (!afip) {
      return NextResponse.json(
        { error: 'AFIP no configurado' },
        { status: 400 }
      );
    }

    // Emitir comprobante real en AFIP (Factura C - tipo 11)
    const total = factura.monto;
    const today = new Date();
    const fechaCbte = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;

    const voucher = await afip.ElectronicBilling.createVoucher({
      CantReg: 1,
      PtoVta: 1,
      CbteTipo: 11,
      Concepto: 1,
      DocTipo: 99,
      DocNro: 0,
      CbteDesde: Number(factura.numero),
      CbteHasta: Number(factura.numero),
      CbteFch: fechaCbte,
      ImpTotal: total,
      ImpTotConc: 0,
      ImpNeto: total,
      ImpOpEx: 0,
      ImpIVA: 0,
      ImpTrib: 0,
      MonId: 'PES',
      MonCotiz: 1,
    });

    const cae = voucher.CAE;
    const caeVtoStr = voucher.CAEFchVto; // YYYYMMDD
    const caeVto = new Date(
      Number(caeVtoStr.substring(0, 4)),
      Number(caeVtoStr.substring(4, 6)) - 1,
      Number(caeVtoStr.substring(6, 8))
    );

    const facturaActualizada = await prisma.factura.update({
      where: { id },
      data: { afipEstado: 'enviado', cae, caeVto } as any,
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
  } catch (error: unknown) {
    console.error('Error en AFIP:', error);
    return NextResponse.json(
      { error: 'Error procesando AFIP' },
      { status: 500 }
    );
  }
}
