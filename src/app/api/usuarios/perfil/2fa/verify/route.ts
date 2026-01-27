import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import speakeasy from "speakeasy";

/**
 * Generar códigos de respaldo
 */
function generateBackupCodes(count: number = 10): string[] {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    codes.push(code);
  }
  return codes;
}

/**
 * POST /api/usuarios/perfil/2fa/verify
 * Verificar código de 2FA y activar
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return Response.json({ error: "No autenticado" }, { status: 401 });
    }

    const { secret, token } = await req.json();

    if (!secret || !token) {
      return Response.json({ error: "Secret y token son requeridos" }, { status: 400 });
    }

    // Verificar el token
    const isValidToken = speakeasy.totp.verify({
      secret: secret,
      encoding: "base32",
      token: token,
      window: 2, // Permite 2 ventanas de tiempo (30 segundos cada una)
    });

    if (!isValidToken) {
      return Response.json({ error: "Código inválido o expirado" }, { status: 401 });
    }

    // Generar códigos de respaldo
    const backupCodes = generateBackupCodes();

    // Guardar en la base de datos
    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        twoFactorEnabled: true,
        twoFactorSecret: secret,
        twoFactorBackupCodes: backupCodes,
      },
    });

    return Response.json({
      success: true,
      message: "2FA activado exitosamente",
      backupCodes: backupCodes,
    });
  } catch (error) {
    console.error("Error en POST /api/usuarios/perfil/2fa/verify:", error);
    return Response.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
