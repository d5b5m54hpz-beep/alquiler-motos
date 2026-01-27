import { extractArgentineDriverLicense } from "@/lib/verifik";

interface LicenseVerifyRequest {
  frontImage: string; // base64 data URL or public URL
  backImage?: string; // optional back side
  fields?: string[];  // optional specific fields to extract
  expected?: {
    dni?: string;
    fullName?: string;
    licenseNumber?: string;
    expiryDate?: string; // ISO or dd/mm/yyyy
  };
}

export async function POST(req: Request) {
  try {
    const body: LicenseVerifyRequest = await req.json();
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

    // Optional simple validation against expected values
    let matches = true;
    const mismatches: string[] = [];
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

    return Response.json({ ok: true, data, matches, mismatches });
  } catch (err: any) {
    return Response.json({ error: err?.message || "Unexpected error" }, { status: 500 });
  }
}
