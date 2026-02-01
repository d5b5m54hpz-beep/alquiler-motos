import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import speakeasy from "speakeasy";
import QRCode from "qrcode";

/**
 * POST /api/usuarios/perfil/2fa/setup
 * Generar código secreto y QR para 2FA
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return Response.json({ error: "No autenticado" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, email: true, name: true },
    });

    if (!user) {
      return Response.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    // Generar secreto
    const secret = speakeasy.generateSecret({
      name: `Alquiler Motos (${user.email})`,
      issuer: "Alquiler Motos",
      length: 32,
    });

    // Generar QR code
    const qrCode = await QRCode.toDataURL(secret.otpauth_url || "");

    return Response.json({
      secret: secret.base32,
      qrCode,
      otpauth_url: secret.otpauth_url,
    });
  } catch (error) {
    console.error("Error en POST /api/usuarios/perfil/2fa/setup:", error);
    return Response.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
