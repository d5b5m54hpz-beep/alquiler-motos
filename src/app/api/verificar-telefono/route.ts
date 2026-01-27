import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

/**
 * POST /api/verificar-telefono
 * Body: { phone: string }
 * 
 * Simulates WhatsApp OTP flow:
 * 1. Generate a 6-digit code (for demo, just return it; in production send via WhatsApp API)
 * 2. Store code temporarily (in-memory or Redis)
 * 3. Client sends code back to /api/verificar-telefono/confirmar
 */
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const body = await req.json();
  const { phone } = body;

  if (!phone) {
    return Response.json({ error: "Phone required" }, { status: 400 });
  }

  const userId = (session.user as any).id;

  // For demo: generate 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  // TODO: In production, send via WhatsApp API and store code in cache
  // For now, just return it so frontend can simulate verification
  return Response.json({ code, message: "Codigo enviado (demo)" });
}
