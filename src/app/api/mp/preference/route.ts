import { MercadoPagoConfig, Preference } from "mercadopago";
import { prisma } from "@/lib/prisma";

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN || "" });

export async function POST(req: Request) {
  try {
    const { pagoId, monto } = await req.json();
    if (!pagoId || !monto) {
      return new Response("Missing pagoId or monto", { status: 400 });
    }

    const pago = await prisma.pago.findUnique({ where: { id: pagoId } });
    if (!pago) {
      return new Response("Pago not found", { status: 404 });
    }

    const preference = new Preference(client);
    const result = await preference.create({
      body: {
        items: [{ id: String(pagoId), title: "Alquiler moto", quantity: 1, unit_price: Number(monto) }],
        external_reference: String(pagoId),
        back_urls: { success: "/pagos", failure: "/pagos" },
        auto_return: "approved",
      },
    });

    return Response.json({ url: result.init_point, id: result.id });
  } catch (e) {
    console.error(e);
    return new Response("Error creating preference", { status: 500 });
  }
}
