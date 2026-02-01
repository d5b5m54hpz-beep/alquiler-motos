import { MercadoPagoConfig } from "mercadopago";
import { prisma } from "@/lib/prisma";

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN || "" });

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Optional simple secret check via header
    const secretHeader = (req.headers as any).get?.("x-webhook-secret");
    if (process.env.MP_WEBHOOK_SECRET && secretHeader !== process.env.MP_WEBHOOK_SECRET) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const externalRef = body?.data?.external_reference || body?.external_reference;
    const status = body?.data?.status || body?.collection_status || body?.status;

    if (externalRef && String(status).toLowerCase() === "approved") {
      const pagoId = String(externalRef);
      await prisma.pago.update({
        where: { id: pagoId },
        data: { estado: "pagado", pagadoAt: new Date() },
      });
    }

    return Response.json({ ok: true });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Error processing webhook" }, { status: 500 });
  }
}
