import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/authz";
import bcrypt from "bcrypt";

export async function GET() {
  await requireRole(["admin"]);

  const usuarios = await prisma.usuario.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      nombre: true,
      rol: true,
      activo: true,
      createdAt: true,
    },
  });

  return Response.json(usuarios);
}

export async function POST(req: Request) {
  await requireRole(["admin"]);

  const body = await req.json();
  const { email, nombre, password, rol } = body;

  if (!email || !nombre || !password || !rol) {
    return Response.json(
      { error: "Datos incompletos" },
      { status: 400 }
    );
  }

  const hash = await bcrypt.hash(password, 10);

  const usuario = await prisma.usuario.create({
    data: {
      email,
      nombre,
      password: hash,
      rol,
    },
  });

  return Response.json(usuario, { status: 201 });
}
