export async function GET(req: Request) {
  const headers = Object.fromEntries((req as any).headers?.entries?.() ?? []);
  return Response.json({ headers });
}