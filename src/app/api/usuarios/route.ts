import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/authz";
import bcrypt from "bcryptjs";

export async function GET() {
  const { error } = await requireRole(["admin"]);
  if (error) return error;

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      provider: true,
      phoneVerifiedAt: true,
      createdAt: true,
    },
  });

  return Response.json(users);
}

export async function POST(req: Request) {
  const { error } = await requireRole(["admin"]);
  if (error) return error;

  const body = await req.json();
  const { email, name, password, role } = body;

  if (!email || !name || !role) {
    return Response.json(
      { error: "Datos incompletos" },
      { status: 400 }
    );
  }

  const hash = password ? await bcrypt.hash(password, 10) : null;

  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hash,
      role,
      provider: "credentials",
    },
  });

  return Response.json(user, { status: 201 });
}
