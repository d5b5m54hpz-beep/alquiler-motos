export async function GET(req: Request) {
  const headers = (req as any).headers as Headers | undefined;
  const xApiKey = headers?.get("x-api-key");
  const authHeader = headers?.get("authorization");
  const bearer = authHeader?.toLowerCase().startsWith("bearer ")
    ? authHeader.slice(7)
    : undefined;
  const provided = xApiKey || bearer;
  const apiKey = process.env.RETOOL_API_KEY;
  const result = {
    hasHeader: Boolean(provided),
    usedHeader: xApiKey ? "x-api-key" : bearer ? "authorization" : null,
    providedLength: provided?.length ?? 0,
    apiKeyPresent: Boolean(apiKey),
    apiKeyLength: apiKey?.length ?? 0,
    matches: apiKey && provided ? apiKey === provided : false,
    rolesWouldAllowAuditor: true,
  };
  return Response.json(result);
}
