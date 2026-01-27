import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return Response.json(
        { error: "Todos los campos son requeridos" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return Response.json(
        { error: "Este email ya está registrado" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with role "cliente"
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: "cliente",
        provider: "credentials",
      },
    });

    // Create Cliente record
    await prisma.cliente.create({
      data: {
        userId: user.id,
        nombre: name,
        email,
      },
    });

    return Response.json(
      { success: true, message: "Cuenta creada exitosamente" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return Response.json(
      { error: "Error al crear la cuenta" },
      { status: 500 }
    );
  }
}
