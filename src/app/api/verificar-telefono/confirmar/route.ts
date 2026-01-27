import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

/**
 * POST /api/verificar-telefono/confirmar
 * Body: { code: string, phone: string }
 * 
 * Verifies the OTP code and marks phone as verified.
 */
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const body = await req.json();
  const { code, phone } = body;

  if (!code || !phone) {
    return Response.json({ error: "Code and phone required" }, { status: 400 });
  }

  // TODO: Validate code from cache (Redis/in-memory store)
  // For demo, accept any 6-digit code
  if (code.length !== 6) {
    return Response.json({ error: "Codigo invalido" }, { status: 400 });
  }

  const userId = (session.user as any).id;

  // Update user phone and phoneVerifiedAt
  await prisma.user.update({
    where: { id: userId },
    data: {
      phone,
      phoneVerifiedAt: new Date(),
    },
  });

  return Response.json({ success: true, message: "Telefono verificado" });
}
