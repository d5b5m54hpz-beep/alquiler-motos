import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/authz";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  await requireRole(["admin"]);

  const body = await req.json();
  const { rol, activo } = body;

  const usuario = await prisma.usuario.update({
    where: { id: params.id },
    data: {
      rol,
      activo,
    },
  });

  return Response.json(usuario);
}
