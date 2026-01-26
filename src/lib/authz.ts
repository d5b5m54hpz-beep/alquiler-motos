import { auth } from "@/auth";

export async function requireRole(
  roles: Array<"admin" | "operador" | "auditor">
) {
  const session = await auth();

  if (!session) {
    throw new Error("UNAUTHORIZED");
  }

  const role = (session as any).role;

  if (!roles.includes(role)) {
    throw new Error("FORBIDDEN");
  }

  return session;
}
