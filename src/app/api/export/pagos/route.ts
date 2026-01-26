import { prisma } from "@/lib/prisma";

export async function GET() {
  const pagos = await prisma.pago.findMany({
    include: {
      contrato: {
        include: {
          cliente: true,
          moto: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const header = [
    "Fecha",
    "Cliente",
    "Moto",
    "Monto",
    "Metodo",
    "Estado",
  ];

  const rows = pagos.map((p) => [
    p.createdAt.toISOString().split("T")[0],
    p.contrato.cliente.nombre,
    `${p.contrato.moto.marca} ${p.contrato.moto.modelo}`,
    p.monto,
    p.metodo,
    p.estado,
  ]);

  const csv = [header, ...rows]
    .map((row) => row.join(","))
    .join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="pagos.csv"`,
    },
  });
}
