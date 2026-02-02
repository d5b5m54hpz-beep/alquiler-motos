import { prisma } from "@/lib/prisma";
import { performKYC } from "@/lib/verifik";

interface ValidateDNIRequest {
  dni: string;
  nombre?: string;
  email?: string;
  checkOnly?: boolean; // true = solo validación, false = crear cliente si válido
}

export async function POST(req: Request) {
  try {
    const body: ValidateDNIRequest = await req.json();
    const { dni, nombre, email, checkOnly } = body;

    if (!dni) {
      return Response.json(
        { error: "DNI es requerido" },
        { status: 400 }
      );
    }

    // Basic format validation
    const cleaned = dni.replace(/\D/g, "");
    if (cleaned.length !== 8) {
      return Response.json(
        { error: "DNI debe tener 8 dígitos" },
        { status: 400 }
      );
    }

    // Perform Verifik KYC validation
    const kyc = await performKYC(cleaned, nombre);

    // Guardar en historial
    const verificacionAlerta = await prisma.alerta.create({
      data: {
        tipo: "VERIFICACION_DNI",
        mensaje: `Verificación DNI: ${nombre || cleaned} - ${kyc.verified ? "Aprobado" : "Rechazado"} (Riesgo: ${kyc.riskLevel})`,
        dniVerificacion: {
          dni: cleaned,
          nombre,
          email,
          verificado: kyc.verified,
          riesgoNivel: kyc.riskLevel,
          razonRechazo: !kyc.verified ? kyc.details.verification.error : null,
          detalles: kyc.details as any,
        } as any,
      },
    });

    if (!kyc.verified) {
      return Response.json(
        {
          valid: false,
          error: "No se pudo verificar el DNI",
          riskLevel: kyc.riskLevel,
          details: kyc.details,
          verificacionId: verificacionAlerta.id,
        },
        { status: 400 }
      );
    }

    // High risk - require additional validation
    if (kyc.riskLevel === 'HIGH') {
      return Response.json(
        {
          valid: false,
          error: "DNI reporta riesgo alto. Contactar a administrador.",
          riskLevel: kyc.riskLevel,
          verificacionId: verificacionAlerta.id,
        },
        { status: 403 }
      );
    }

    // If only checking, return result
    if (checkOnly) {
      return Response.json({
        valid: true,
        verified: true,
        riskLevel: kyc.riskLevel,
        message: "DNI válido y verificado",
      });
    }

    // Note: Clientes are now auto-created via User authentication flow
    // This endpoint only validates DNI data, not create clientes manually
    return Response.json({
      valid: true,
      verified: true,
      riskLevel: kyc.riskLevel,
      message: "DNI válido y verificado (cliente no creado)",
    });
  } catch (error: unknown) {
    console.error("Error validando DNI:", error);
    return Response.json(
      { error: "Error validando DNI" },
      { status: 500 }
    );
  }
}
