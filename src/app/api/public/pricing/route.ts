import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Buscar configuración existente
    let pricing = await prisma.pricingConfig.findFirst();

    if (!pricing) {
      // Crear configuración por defecto si no existe
      pricing = await prisma.pricingConfig.create({
        data: {
          precioBaseMensual: 150,
          descuentoSemanal: 10,
          descuentoMeses3: 0,
          descuentoMeses6: 5,
          descuentoMeses9: 10,
          descuentoMeses12: 15,
        },
      });
    }

    const config = {
      precioBaseMensual: pricing.precioBaseMensual,
      descuentoSemanal: pricing.descuentoSemanal,
      duraciones: {
        meses3: pricing.descuentoMeses3,
        meses6: pricing.descuentoMeses6,
        meses9: pricing.descuentoMeses9,
        meses12: pricing.descuentoMeses12,
      },
    };

    return NextResponse.json(config);
  } catch (error) {
    console.error("Error obteniendo configuración de precios:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}