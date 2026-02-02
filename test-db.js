// 🗄️ Database Connectivity Test
// Run with: node test-db.js

const { PrismaClient } = require('@prisma/client');

async function testDatabaseConnection() {
  console.log('🔍 Testing Database Connection...\n');

  const prisma = new PrismaClient();

  try {
    // Test basic connection
    console.log('1. Testing basic connection...');
    await prisma.$connect();
    console.log('✅ Database connection successful\n');

    // Test user table
    console.log('2. Testing User table...');
    const userCount = await prisma.user.count();
    console.log(`✅ Found ${userCount} users in database`);

    const users = await prisma.user.findMany({
      select: { id: true, email: true, role: true, createdAt: true },
      take: 3
    });
    console.log('Sample users:', users.map(u => `${u.email} (${u.role})`));
    console.log('');

    // Test cliente table
    console.log('3. Testing Cliente table...');
    const clienteCount = await prisma.cliente.count();
    console.log(`✅ Found ${clienteCount} clients in database`);

    const clientes = await prisma.cliente.findMany({
      select: { id: true, nombre: true, email: true },
      take: 3
    });
    console.log('Sample clients:', clientes.map(c => `${c.nombre} (${c.email})`));
    console.log('');

    // Test moto table
    console.log('4. Testing Moto table...');
    const motoCount = await prisma.moto.count();
    console.log(`✅ Found ${motoCount} motorcycles in database`);

    const motos = await prisma.moto.findMany({
      select: { id: true, marca: true, modelo: true, patente: true, estado: true },
      take: 3
    });
    console.log('Sample motorcycles:', motos.map(m => `${m.marca} ${m.modelo} (${m.patente}) - ${m.estado}`));
    console.log('');

    // Test contrato table
    console.log('5. Testing Contrato table...');
    const contratoCount = await prisma.contrato.count();
    console.log(`✅ Found ${contratoCount} contracts in database`);

    const contratos = await prisma.contrato.findMany({
      select: {
        id: true,
        fechaInicio: true,
        fechaFin: true,
        estado: true,
        moto: { select: { marca: true, modelo: true } },
        cliente: { select: { nombre: true } }
      },
      take: 3
    });
    console.log('Sample contracts:');
    contratos.forEach(c => {
      console.log(`  - ${c.moto.marca} ${c.moto.modelo} for ${c.cliente.nombre} (${c.fechaInicio.toDateString()} - ${c.fechaFin.toDateString()})`);
    });
    console.log('');

    // Test pago table
    console.log('6. Testing Pago table...');
    const pagoCount = await prisma.pago.count();
    console.log(`✅ Found ${pagoCount} payments in database`);

    const pagos = await prisma.pago.findMany({
      select: {
        id: true,
        monto: true,
        estado: true,
        fechaPago: true,
        contrato: {
          select: {
            moto: { select: { marca: true, modelo: true } },
            cliente: { select: { nombre: true } }
          }
        }
      },
      take: 3
    });
    console.log('Sample payments:');
    pagos.forEach(p => {
      console.log(`  - $${p.monto} for ${p.contrato.moto.marca} ${p.contrato.moto.modelo} (${p.contrato.cliente.nombre}) - ${p.estado}`);
    });
    console.log('');

    console.log('🎉 All database tests passed!');

  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Performance test
async function testPerformance() {
  console.log('\n⚡ Testing Database Performance...\n');

  const prisma = new PrismaClient();
  const iterations = 10;

  try {
    console.log(`Running ${iterations} queries...`);

    const startTime = Date.now();

    for (let i = 0; i < iterations; i++) {
      await prisma.user.count();
      await prisma.moto.findMany({ take: 5 });
      await prisma.contrato.findMany({
        take: 5,
        include: { moto: true, cliente: true }
      });
    }

    const endTime = Date.now();
    const totalTime = endTime - startTime;
    const avgTime = totalTime / iterations;

    console.log(`✅ Total time: ${totalTime}ms`);
    console.log(`✅ Average query time: ${avgTime.toFixed(2)}ms per iteration`);

    if (avgTime < 100) {
      console.log('🚀 Performance looks good!');
    } else if (avgTime < 500) {
      console.log('⚠️  Performance is acceptable but could be optimized');
    } else {
      console.log('🐌 Performance needs optimization');
    }

  } catch (error) {
    console.error('❌ Performance test failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

// Run tests
async function main() {
  await testDatabaseConnection();
  await testPerformance();
  console.log('\n✨ Database testing completed!');
}

main().catch(console.error);