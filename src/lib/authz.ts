import { auth } from "@/auth";

export async function requireRole(
  roles: Array<"admin" | "operador" | "cliente">,
): Promise<{ error: Response | null; role?: "admin" | "operador" | "cliente"; userId?: string }> {
  const session = await auth();

  if (!session || !session.user) {
    return { error: Response.json({ error: "UNAUTHORIZED" }, { status: 401 }) };
  }

  const role = (session.user as any).role as "admin" | "operador" | "cliente" | undefined;
  const userId = (session.user as any).id as string | undefined;

  if (!role || !roles.includes(role)) {
    return { error: Response.json({ error: "FORBIDDEN" }, { status: 403 }) };
  }

  return { error: null, role, userId };
}
