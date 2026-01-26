import { prisma } from "@/lib/prisma";
import PDFDocument from "pdfkit";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const factura = await prisma.factura.findUnique({
    where: { id },
    include: {
      contrato: {
        include: {
          cliente: true,
          moto: true,
        },
      },
    },
  });

  if (!factura) {
    return new Response("Factura no encontrada", { status: 404 });
  }

  const doc = new PDFDocument({ size: "A4", margin: 50 });

  const chunks: Buffer[] = [];
  doc.on("data", (chunk) => chunks.push(chunk));
  doc.on("end", () => {});

  // ENCABEZADO
  doc.fontSize(20).text("FACTURA", { align: "center" });
  doc.moveDown();

  doc.fontSize(12);
  doc.text(`Número: ${factura.numero}`);
  doc.text(`Fecha: ${new Date(factura.emitidaAt).toLocaleDateString()}`);
  doc.moveDown();

  // CLIENTE
  doc.fontSize(14).text("Cliente");
  doc.fontSize(12);
  doc.text(`Nombre: ${factura.contrato.cliente.nombre}`);
  doc.text(`DNI: ${factura.contrato.cliente.dni}`);
  doc.moveDown();

  // MOTO
  doc.fontSize(14).text("Moto");
  doc.fontSize(12);
  doc.text(`Patente: ${factura.contrato.moto.patente}`);
  doc.text(
    `Modelo: ${factura.contrato.moto.marca} ${factura.contrato.moto.modelo}`
  );
  doc.moveDown();

  // MONTO
  doc.fontSize(14).text("Detalle");
  doc.fontSize(12);
  doc.text(`Monto total: $${factura.monto}`);
  doc.moveDown(2);

  doc.text("Gracias por su pago.", { align: "center" });

  doc.end();

  const pdfBuffer = await new Promise<Buffer>((resolve) => {
    const buffer = Buffer.concat(chunks);
    resolve(buffer);
  });

  return new Response(pdfBuffer as any, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="factura-${factura.numero}.pdf"`,
    },
  });
}
