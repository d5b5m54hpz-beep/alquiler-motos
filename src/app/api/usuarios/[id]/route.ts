import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/authz";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { error } = await requireRole(["admin"]);
  if (error) return error;

  const body = await req.json();
  const { role, phoneVerifiedAt } = body;
  const { id } = await context.params;

  const user = await prisma.user.update({
    where: { id },
    data: {
      role,
      phoneVerifiedAt: phoneVerifiedAt ? new Date(phoneVerifiedAt) : undefined,
    },
  });

  return Response.json(user);
}
