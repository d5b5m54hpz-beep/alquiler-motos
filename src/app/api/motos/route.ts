import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
// import { requireRole } from "@/lib/authz";

export async function GET() {
  try {
    // const { error } = await requireRole(["admin", "operador", "cliente"]);
    // if (error) return error;

    const motos = await prisma.moto.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { contratos: true },
        },
      },
    });
    return Response.json(motos);
  } catch (error) {
    console.error(error);
    return new Response("Error fetching motos", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { error } = await requireRole(["admin", "operador"]);
    if (error) return error;

    const body = await req.json();
    const { marca, modelo, patente, anio, estado } = body;

    if (!marca || !modelo || !patente || !anio) {
      return new Response("Marca, modelo, patente y año son requeridos", { status: 400 });
    }

    const moto = await prisma.moto.create({
      data: { marca, modelo, patente, anio: Number(anio), estado: estado || "disponible" },
    });

    return Response.json(moto);
  } catch (error: any) {
    console.error(error);
    if (error.code === "P2002") {
      return new Response("Patente ya existe", { status: 400 });
    }
    return new Response("Error creating moto", { status: 500 });
  }
}
