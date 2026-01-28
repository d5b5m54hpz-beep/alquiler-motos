import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Limpiando BD...");
  await prisma.alerta.deleteMany();
  await prisma.pago.deleteMany();
  await prisma.contrato.deleteMany();
  await prisma.moto.deleteMany();
  await prisma.cliente.deleteMany();
  await prisma.user.deleteMany();

  console.log("🌱 Creando usuario admin...");
  const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
  const adminPass = process.env.ADMIN_PASSWORD || "admin123";
  const hash = await bcrypt.hash(adminPass, 10);
  const adminUser = await prisma.user.create({
    data: {
      email: adminEmail,
      name: "Admin",
      role: "admin",
      password: hash,
      provider: "credentials",
    },
  });

  console.log("🌱 Creando usuarios cliente con sus clientes...");
  const clienteUser1 = await prisma.user.create({
    data: {
      email: "juan@example.com",
      name: "Juan Pérez",
      role: "cliente",
      provider: "credentials",
      password: await bcrypt.hash("cliente123", 10),
    },
  });

  const cliente1 = await prisma.cliente.create({
    data: {
      userId: clienteUser1.id,
      nombre: "Juan Pérez",
      telefono: "1123456789",
      email: "juan@example.com",
    },
  });

  const clienteUser2 = await prisma.user.create({
    data: {
      email: "maria@example.com",
      name: "María García",
      role: "cliente",
      provider: "credentials",
      password: await bcrypt.hash("cliente123", 10),
    },
  });

  const cliente2 = await prisma.cliente.create({
    data: {
      userId: clienteUser2.id,
      nombre: "María García",
      telefono: "1187654321",
      email: "maria@example.com",
    },
  });

  console.log("🌱 Creando motos...");
  const moto1 = await prisma.moto.create({
    data: {
      marca: "Honda",
      modelo: "CB500",
      patente: "ABC123",
      anio: 2020,
      estado: "disponible",
    },
  });

  const moto2 = await prisma.moto.create({
    data: {
      marca: "Yamaha",
      modelo: "YZF-R3",
      patente: "XYZ789",
      anio: 2021,
      estado: "disponible",
    },
  });

  console.log("🌱 Creando contratos...");
  const hoy = new Date();
  
  // Contrato 1: Vence en 2 días (deberá crear alerta de contrato por vencer)
  const fechaFin1 = new Date();
  fechaFin1.setDate(hoy.getDate() + 2);

  const contrato1 = await prisma.contrato.create({
    data: {
      clienteId: cliente1.id,
      motoId: moto1.id,
      fechaInicio: new Date(),
      fechaFin: fechaFin1,
      precioSemana: 500,
      estado: "activo",
    },
  });

  // Contrato 2: Vence en 1 mes (sin alerta)
  const fechaFin2 = new Date();
  fechaFin2.setDate(hoy.getDate() + 30);

  const contrato2 = await prisma.contrato.create({
    data: {
      clienteId: cliente2.id,
      motoId: moto2.id,
      fechaInicio: new Date(),
      fechaFin: fechaFin2,
      precioSemana: 600,
      estado: "activo",
    },
  });

  console.log("🌱 Creando pagos...");
  
  // Pago 1: Vencido hace 3 días (deberá crear alerta de pago vencido)
  const vencimientoAt1 = new Date();
  vencimientoAt1.setDate(hoy.getDate() - 3);

  const pago1 = await prisma.pago.create({
    data: {
      contratoId: contrato1.id,
      monto: 500,
      metodo: "transferencia",
      estado: "pendiente",
      vencimientoAt: vencimientoAt1,
    },
  });

  // Pago 2: Vence en 5 días (sin alerta aún)
  const vencimientoAt2 = new Date();
  vencimientoAt2.setDate(hoy.getDate() + 5);

  const pago2 = await prisma.pago.create({
    data: {
      contratoId: contrato2.id,
      monto: 600,
      metodo: "efectivo",
      estado: "pendiente",
      vencimientoAt: vencimientoAt2,
    },
  });

  // Pago 3: Ya pagado
  const pago3 = await prisma.pago.create({
    data: {
      contratoId: contrato1.id,
      monto: 500,
      metodo: "transferencia",
      estado: "pagado",
      pagadoAt: new Date(),
      vencimientoAt: new Date(),
    },
  });

  console.log("✅ BD populada exitosamente!");
  console.log(`\n📊 Datos creados:`);
  console.log(`   - 2 usuarios cliente + 2 clientes`);
  console.log(`   - 2 motos`);
  console.log(`   - 2 contratos`);
  console.log(`   - 3 pagos`);
  console.log(`   - 1 usuario admin`);
  console.log(`\n🚀 Próximos pasos:`);
  console.log(`   1. Ejecuta: curl -X POST http://localhost:3000/api/jobs/contratos-por-vencer`);
  console.log(`   2. Ejecuta: curl -X POST http://localhost:3000/api/jobs/vencimientos`);
  console.log(`   3. Verifica las alertas en: http://localhost:3000/alertas`);
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
