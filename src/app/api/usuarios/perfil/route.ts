import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

/**
 * GET /api/usuarios/perfil
 * Obtener el perfil del usuario autenticado
 */
export async function GET(req: NextRequest) {
  try {
    const session = await auth(req);

    if (!session?.user?.email) {
      return Response.json({ error: "No autenticado" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        phoneVerifiedAt: true,
        provider: true,
      },
    });

    if (!user) {
      return Response.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    return Response.json(user);
  } catch (error: unknown) {
    console.error("Error en GET /api/usuarios/perfil:", error);
    return Response.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

/**
 * PUT /api/usuarios/perfil
 * Actualizar el perfil del usuario
 */
export async function PUT(req: NextRequest) {
  try {
    const session = await auth(req);

    if (!session?.user?.email) {
      return Response.json({ error: "No autenticado" }, { status: 401 });
    }

    const { name, phone } = await req.json();

    if (!name || name.trim().length === 0) {
      return Response.json({ error: "El nombre es requerido" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name: name.trim(),
        phone: phone && phone.trim() ? phone.trim() : null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        phoneVerifiedAt: true,
        provider: true,
      },
    });

    return Response.json(updatedUser);
  } catch (error: unknown) {
    console.error("Error en PUT /api/usuarios/perfil:", error);
    return Response.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
