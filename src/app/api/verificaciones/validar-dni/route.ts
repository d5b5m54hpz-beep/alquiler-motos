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

    // Check if DNI already exists
    const existingCliente = await prisma.cliente.findFirst({
      where: { dni: cleaned },
    });

    if (existingCliente) {
      return Response.json(
        {
          valid: false,
          error: "DNI ya registrado en el sistema",
          existing: existingCliente,
        },
        { status: 409 }
      );
    }

    // Perform Verifik KYC validation
    const kyc = await performKYC(cleaned, nombre);

    if (!kyc.verified) {
      return Response.json(
        {
          valid: false,
          error: "No se pudo verificar el DNI",
          riskLevel: kyc.riskLevel,
          details: kyc.details,
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

    // Create cliente if valid and not just checking
    if (nombre) {
      const cliente = await prisma.cliente.create({
        data: {
          dni: cleaned,
          nombre,
          email: email || null,
          telefono: "",
        },
      });

      return Response.json(
        {
          valid: true,
          verified: true,
          riskLevel: kyc.riskLevel,
          cliente,
          message: "Cliente creado exitosamente",
        },
        { status: 201 }
      );
    }

    return Response.json({
      valid: true,
      verified: true,
      riskLevel: kyc.riskLevel,
      message: "DNI válido y verificado. Proporciona nombre para crear cliente.",
    });
  } catch (error) {
    console.error("Error validando DNI:", error);
    return Response.json(
      { error: "Error validando DNI" },
      { status: 500 }
    );
  }
}
