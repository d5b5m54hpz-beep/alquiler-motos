import { auth } from "@/auth";
import { Role } from "@/lib/roles";

export async function requireRole(
  roles: Role[],
): Promise<{ error: Response | null; role?: Role; userId?: string }> {
  const session = await auth();

  if (!session || !session.user) {
    return { error: Response.json({ error: "UNAUTHORIZED" }, { status: 401 }) };
  }

  const role = (session.user as any).role as Role | undefined;
  const userId = (session.user as any).id as string | undefined;

  if (!role || !roles.includes(role)) {
    return { error: Response.json({ error: "FORBIDDEN" }, { status: 403 }) };
  }

  return { error: null, role, userId };
}
