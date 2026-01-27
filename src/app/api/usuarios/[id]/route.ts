import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/authz";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const authError = await requireRole(["admin"], req);
  if (authError) return authError;

  const body = await req.json();
  const { rol, activo } = body;
  const { id } = await context.params;

  const usuario = await prisma.usuario.update({
    where: { id },
    data: {
      rol,
      activo,
    },
  });

  return Response.json(usuario);
}
