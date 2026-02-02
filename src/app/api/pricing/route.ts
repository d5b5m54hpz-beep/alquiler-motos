import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type PricingConfig = {
  precioBaseMensual: number;
  descuentoSemanal: number;
  duraciones: {
    meses3: number;
    meses6: number;
    meses9: number;
    meses12: number;
  };
};

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

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

    const config: PricingConfig = {
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

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body: PricingConfig = await request.json();

    // Validar datos
    if (
      typeof body.precioBaseMensual !== "number" ||
      typeof body.descuentoSemanal !== "number" ||
      !body.duraciones ||
      typeof body.duraciones.meses3 !== "number" ||
      typeof body.duraciones.meses6 !== "number" ||
      typeof body.duraciones.meses9 !== "number" ||
      typeof body.duraciones.meses12 !== "number"
    ) {
      return NextResponse.json(
        { error: "Datos inválidos" },
        { status: 400 }
      );
    }

    // Actualizar o crear configuración
    let pricing = await prisma.pricingConfig.findFirst();

    if (pricing) {
      // Actualizar existente
      await prisma.pricingConfig.update({
        where: { id: pricing.id },
        data: {
          precioBaseMensual: body.precioBaseMensual,
          descuentoSemanal: body.descuentoSemanal,
          descuentoMeses3: body.duraciones.meses3,
          descuentoMeses6: body.duraciones.meses6,
          descuentoMeses9: body.duraciones.meses9,
          descuentoMeses12: body.duraciones.meses12,
        },
      });
    } else {
      // Crear nuevo
      await prisma.pricingConfig.create({
        data: {
          precioBaseMensual: body.precioBaseMensual,
          descuentoSemanal: body.descuentoSemanal,
          descuentoMeses3: body.duraciones.meses3,
          descuentoMeses6: body.duraciones.meses6,
          descuentoMeses9: body.duraciones.meses9,
          descuentoMeses12: body.duraciones.meses12,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error guardando configuración de precios:", error);
    return NextResponse.json(
      { error: `Error guardando configuración: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
}