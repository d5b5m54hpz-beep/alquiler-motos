import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const count = await prisma.factura.count();
    return Response.json({ 
      ok: true, 
      message: "Tabla Factura existe",
      count 
    });
  } catch (err: any) {
    return Response.json(
      { 
        error: err.message,
        code: err.code,
      },
      { status: 500 }
    );
  }
}
