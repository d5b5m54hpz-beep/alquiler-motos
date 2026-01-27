import { auth } from "@/auth";

/**
 * Checks if the request carries a valid service API key intended for Retool access.
 * If valid, it grants the minimal read-only role ("auditor").
 */
function hasServiceAccess(
  roles: Array<"admin" | "operador" | "auditor">,
  req?: Request
): boolean {
  const apiKey = process.env.RETOOL_API_KEY;
  if (!apiKey || !req) return false;
  try {
    const headers = (req as any).headers as Headers | undefined;
    const xApiKey = headers?.get("x-api-key");
    const authHeader = headers?.get("authorization");
    const bearer = authHeader?.toLowerCase().startsWith("bearer ")
      ? authHeader.slice(7)
      : undefined;
    const provided = (xApiKey || bearer)?.trim();
    const expected = apiKey.trim();
    if (!provided) return false;
    if (provided !== expected) return false;
    return roles.includes("auditor");
  } catch {
    return false;
  }
}

export async function requireRole(
  roles: Array<"admin" | "operador" | "auditor">,
  req?: Request
): Promise<Response | null> {
  // Allow service API key to satisfy read-only access when permitted.
  if (hasServiceAccess(roles, req)) {
    return null;
  }

  const session = await auth();

  if (!session || !session.user) {
    return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const role = (session.user as any).role;

  if (!role || !roles.includes(role)) {
    return Response.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  return null; // Authorization OK
}
