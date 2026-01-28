// Endpoint de prueba sin autenticación para verificar que JSON funciona
export async function GET() {
  return Response.json({ 
    status: "ok", 
    message: "API funcionando correctamente",
    timestamp: new Date().toISOString() 
  });
}
