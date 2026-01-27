import { extractArgentineDriverLicense } from "@/lib/verifik";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/authz";

interface LicenseSaveRequest {
  clienteId?: string; // optional: associate audit with a client (stored in JSON)
  frontImage: string;
  backImage?: string;
  fields?: string[];
  expected?: {
    dni?: string;
    fullName?: string;
    licenseNumber?: string;
    expiryDate?: string;
  };
}

export async function POST(req: Request) {
  const { error } = await requireRole(["admin", "operador"]);
  if (error) return error;

  try {
    const body: LicenseSaveRequest = await req.json();
    if (!body.frontImage) {
      return Response.json({ error: "frontImage is required" }, { status: 400 });
    }

    const extract = await extractArgentineDriverLicense({
      frontImage: body.frontImage,
      backImage: body.backImage,
      fields: body.fields,
    });

    if (!extract.success) {
      return Response.json({ error: extract.error }, { status: 502 });
    }

    const data = extract.data;

    // Basic matching against expected values
    const mismatches: string[] = [];
    let matches = true;
    const expected = body.expected || {};

    const pluck = (obj: any, keys: string[]) => {
      for (const k of keys) {
        if (obj && typeof obj === "object" && k in obj) return obj[k];
      }
      return undefined;
    };

    const extractedDni = pluck(data, ["dni", "documentNumber", "personalNumber"]);
    if (expected.dni && extractedDni && expected.dni.replace(/\D/g, "") !== String(extractedDni).replace(/\D/g, "")) {
      matches = false;
      mismatches.push("dni");
    }

    const extractedName = pluck(data, ["fullName", "firstName", "lastName"]);
    if (expected.fullName && extractedName && !String(extractedName).toLowerCase().includes(String(expected.fullName).toLowerCase())) {
      matches = false;
      mismatches.push("fullName");
    }

    const extractedLicense = pluck(data, ["licenseNumber", "documentNumber"]);
    if (expected.licenseNumber && extractedLicense && String(expected.licenseNumber) !== String(extractedLicense)) {
      matches = false;
      mismatches.push("licenseNumber");
    }

    const extractedExpiry = pluck(data, ["expiryDate", "validUntil", "dateOfExpiry"]);
    if (expected.expiryDate && extractedExpiry && String(expected.expiryDate) !== String(extractedExpiry)) {
      matches = false;
      mismatches.push("expiryDate");
    }

    // Save audit in Alerta with JSON payload
    const alerta = await prisma.alerta.create({
      data: {
        tipo: "VERIFICACION_LICENCIA",
        mensaje: `Licencia: ${extractedName || expected.fullName || "N/A"} - ${matches ? "OK" : "Mismatch"}`,
        dniVerificacion: {
          clienteId: body.clienteId || null,
          expected,
          extracted: data as any,
          matches,
          mismatches,
        } as any,
      },
    });

    return Response.json({ ok: true, data, matches, mismatches, alertaId: alerta.id });
  } catch (err: any) {
    return Response.json({ error: err?.message || "Unexpected error" }, { status: 500 });
  }
}
