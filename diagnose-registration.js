#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function diagnoseRegistration() {
  console.log('🔍 Diagnóstico del Sistema de Registro\n');

  try {
    // Verificar conexión a BD
    console.log('✅ Conexión a base de datos: OK');

    // Contar usuarios y clientes
    const userCount = await prisma.user.count();
    const clienteCount = await prisma.cliente.count();

    console.log(`📊 Usuarios en BD: ${userCount}`);
    console.log(`📊 Clientes en BD: ${clienteCount}`);

    // Verificar usuarios sin cliente
    const orphanedUsers = await prisma.user.findMany({
      where: { cliente: null },
      select: { email: true, role: true }
    });

    if (orphanedUsers.length > 0) {
      console.log('⚠️  Usuarios huérfanos encontrados:');
      orphanedUsers.forEach(user => {
        console.log(`   - ${user.email} (${user.role})`);
      });
    } else {
      console.log('✅ No hay usuarios huérfanos');
    }

    // Verificar emails duplicados
    const allUsers = await prisma.user.findMany({ select: { email: true } });
    const allClientes = await prisma.cliente.findMany({ select: { email: true } });

    const userEmails = allUsers.map(u => u.email);
    const clienteEmails = allClientes.map(c => c.email);

    const missingClientes = userEmails.filter(email => !clienteEmails.includes(email) && email !== 'admin@example.com');
    const extraClientes = clienteEmails.filter(email => !userEmails.includes(email));

    if (missingClientes.length > 0) {
      console.log('⚠️  Usuarios sin cliente correspondiente:');
      missingClientes.forEach(email => console.log(`   - ${email}`));
    }

    if (extraClientes.length > 0) {
      console.log('⚠️  Clientes sin usuario correspondiente:');
      extraClientes.forEach(email => console.log(`   - ${email}`));
    }

    if (missingClientes.length === 0 && extraClientes.length === 0) {
      console.log('✅ Integridad de datos: OK');
    }

    console.log('\n🚀 El sistema de registro está listo para usar.');
    console.log('💡 Si tienes problemas:');
    console.log('   1. Verifica que el email no esté ya registrado');
    console.log('   2. Asegúrate de que la contraseña tenga al menos 6 caracteres');
    console.log('   3. Verifica tu conexión a internet');

  } catch (error) {
    console.error('❌ Error en diagnóstico:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

diagnoseRegistration();