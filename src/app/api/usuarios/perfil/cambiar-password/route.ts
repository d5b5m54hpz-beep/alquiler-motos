import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";

/**
 * POST /api/usuarios/perfil/cambiar-password
 * Cambiar la contraseña del usuario
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return Response.json({ error: "No autenticado" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return Response.json(
        { error: "Contraseña actual y nueva son requeridas" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return Response.json(
        { error: "La contraseña debe tener al menos 6 caracteres" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, password: true, provider: true },
    });

    if (!user) {
      return Response.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    // Solo usuarios con provider "credentials" pueden cambiar contraseña
    if (user.provider !== "credentials" || !user.password) {
      return Response.json(
        { error: "No puedes cambiar la contraseña de una cuenta OAuth" },
        { status: 400 }
      );
    }

    // Verificar contraseña actual
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return Response.json({ error: "Contraseña actual incorrecta" }, { status: 401 });
    }

    // Hashear y guardar nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return Response.json({ success: true, message: "Contraseña actualizada" });
  } catch (error: unknown) {
    console.error("Error en POST /api/usuarios/perfil/cambiar-password:", error);
    return Response.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
