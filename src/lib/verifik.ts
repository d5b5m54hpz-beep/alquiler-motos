/**
 * Verifik Integration
 * KYC/Identity Verification Service
 * 
 * Environment Variables Required:
 * - VERIFIK_API_KEY
 * - VERIFIK_SECRET
 * - VERIFIK_ENABLED (true/false)
 */

interface VerifikResponse {
  success: boolean;
  verified?: boolean;
  data?: {
    documentNumber: string;
    documentType: string;
    fullName?: string;
    status: string;
    riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
  };
  error?: string;
  message?: string;
}

export async function validateDNIWithVerifik(dni: string): Promise<VerifikResponse> {
  const apiKey = process.env.VERIFIK_API_KEY;
  const secret = process.env.VERIFIK_SECRET;
  const enabled = process.env.VERIFIK_ENABLED === 'true';

  if (!enabled || !apiKey || !secret) {
    return {
      success: false,
      error: 'Verifik not configured',
    };
  }

  try {
    // Validate DNI format first
    const cleaned = dni.replace(/\D/g, '');
    if (cleaned.length !== 8) {
      return {
        success: false,
        error: 'Invalid DNI format',
      };
    }

    /**
     * Verifik API endpoint for DNI validation
     * This is a conceptual implementation - adjust based on actual Verifik API
     */
    const response = await fetch('https://api.verifik.com/v1/document/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'X-Secret': secret,
      },
      body: JSON.stringify({
        documentType: 'DNI',
        documentNumber: cleaned,
        country: 'AR',
      }),
    });

    if (!response.ok) {
      return {
        success: false,
        error: `Verifik API error: ${response.statusText}`,
      };
    }

    const data = await response.json();

    return {
      success: true,
      verified: data.verified || data.status === 'VERIFIED',
      data: {
        documentNumber: cleaned,
        documentType: 'DNI',
        fullName: data.fullName,
        status: data.status,
        riskLevel: data.riskLevel || 'LOW',
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Check for sanctions/antecedents using Verifik
 * Validates against blacklists, fraud databases, etc.
 */
export async function checkAntecedents(
  dni: string,
  fullName?: string
): Promise<{ clean: boolean; riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'; details?: string }> {
  const apiKey = process.env.VERIFIK_API_KEY;
  const enabled = process.env.VERIFIK_ENABLED === 'true';

  if (!enabled || !apiKey) {
    return { clean: true, riskLevel: 'LOW' };
  }

  try {
    const response = await fetch('https://api.verifik.com/v1/screening/check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        documentNumber: dni.replace(/\D/g, ''),
        fullName,
        country: 'AR',
      }),
    });

    if (!response.ok) {
      return { clean: true, riskLevel: 'LOW' };
    }

    const data = await response.json();

    return {
      clean: !data.matched,
      riskLevel: data.riskLevel || 'LOW',
      details: data.details,
    };
  } catch (error) {
    // Fail open - don't block transactions if Verifik is down
    return { clean: true, riskLevel: 'LOW' };
  }
}

/**
 * Perform full KYC validation (DNI + Antecedents)
 */
export async function performKYC(
  dni: string,
  fullName?: string
): Promise<{
  success: boolean;
  verified: boolean;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  details: { verification: VerifikResponse; antecedents: Awaited<ReturnType<typeof checkAntecedents>> };
}> {
  const [verification, antecedents] = await Promise.all([
    validateDNIWithVerifik(dni),
    checkAntecedents(dni, fullName),
  ]);

  const success = verification.success && antecedents.clean;
  const verified = verification.verified && antecedents.clean;
  const riskLevel = antecedents.riskLevel;

  return {
    success,
    verified,
    riskLevel,
    details: { verification, antecedents },
  };
}
