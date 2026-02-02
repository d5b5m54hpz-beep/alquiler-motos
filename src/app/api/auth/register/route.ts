import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return Response.json(
        { error: "Todos los campos son requeridos" },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json(
        { error: "Email inválido" },
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

    console.log(`Creando usuario: ${email}`);

    // Create user and cliente in a transaction
    const result = await prisma.$transaction(async (tx) => {
      console.log(`Creando user para: ${email}`);
      // Create user with role "cliente"
      const user = await tx.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
          role: "cliente",
          provider: "credentials",
        },
      });

      console.log(`User creado con ID: ${user.id}, creando cliente...`);

      // Create Cliente record
      const cliente = await tx.cliente.create({
        data: {
          userId: user.id,
          nombre: name,
          email,
        },
      });

      console.log(`Cliente creado con ID: ${cliente.id}`);

      return { user, cliente };
    });

    console.log(`Registro completado exitosamente para: ${email}`);

    return Response.json(
      { success: true, message: "Cuenta creada exitosamente" },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error creating user:", error);
    const errorMessage = error instanceof Error ? error.message : "Error desconocido";
    return Response.json(
      { error: `Error al crear la cuenta: ${errorMessage}` },
      { status: 500 }
    );
  }
}
