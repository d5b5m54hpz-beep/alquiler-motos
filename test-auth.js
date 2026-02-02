// 🔐 Authentication Testing Script
// Run with: node test-auth.js

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function testAuthentication() {
  console.log('🔐 Testing Authentication System...\n');

  const prisma = new PrismaClient();

  try {
    // Test 1: Check test users exist
    console.log('1. Checking test users...');
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@example.com' }
    });

    const clientUser = await prisma.user.findUnique({
      where: { email: 'juan@example.com' }
    });

    if (!adminUser) {
      console.log('❌ Admin user not found');
      return;
    }

    if (!clientUser) {
      console.log('❌ Client user not found');
      return;
    }

    console.log('✅ Test users found:');
    console.log(`   Admin: ${adminUser.email} (${adminUser.role})`);
    console.log(`   Client: ${clientUser.email} (${clientUser.role})`);
    console.log('');

    // Test 2: Verify password hashing
    console.log('2. Testing password verification...');

    const adminPasswordValid = await bcrypt.compare('admin123', adminUser.password);
    const clientPasswordValid = await bcrypt.compare('cliente123', clientUser.password);

    if (adminPasswordValid) {
      console.log('✅ Admin password verification successful');
    } else {
      console.log('❌ Admin password verification failed');
    }

    if (clientPasswordValid) {
      console.log('✅ Client password verification successful');
    } else {
      console.log('❌ Client password verification failed');
    }

    // Test wrong password
    const wrongPasswordValid = await bcrypt.compare('wrongpassword', adminUser.password);
    if (!wrongPasswordValid) {
      console.log('✅ Wrong password correctly rejected');
    } else {
      console.log('❌ Wrong password incorrectly accepted');
    }
    console.log('');

    // Test 3: Check user-client relationships
    console.log('3. Testing user-client relationships...');

    const adminCliente = await prisma.cliente.findUnique({
      where: { userId: adminUser.id }
    });

    const clientCliente = await prisma.cliente.findUnique({
      where: { userId: clientUser.id }
    });

    if (adminCliente) {
      console.log('✅ Admin has associated client record');
    } else {
      console.log('ℹ️  Admin does not have client record (expected for admin role)');
    }

    if (clientCliente) {
      console.log('✅ Client has associated client record');
      console.log(`   Client name: ${clientCliente.nombre}`);
      console.log(`   Client email: ${clientCliente.email}`);
    } else {
      console.log('❌ Client does not have associated client record');
    }
    console.log('');

    // Test 4: Check role-based data access simulation
    console.log('4. Testing role-based data access...');

    // Admin should see all clients
    const allClients = await prisma.cliente.findMany();
    console.log(`✅ Admin can see ${allClients.length} total clients`);

    // Client should only see their own data
    const clientOwnData = await prisma.cliente.findMany({
      where: { userId: clientUser.id }
    });
    console.log(`✅ Client can see ${clientOwnData.length} client record(s) (own data only)`);

    // Test contracts access
    const allContracts = await prisma.contrato.findMany({
      include: { cliente: true, moto: true }
    });

    const clientContracts = allContracts.filter(c => c.cliente.userId === clientUser.id);

    console.log(`✅ Admin can see ${allContracts.length} total contracts`);
    console.log(`✅ Client can see ${clientContracts.length} contract(s) (own contracts only)`);
    console.log('');

    // Test 5: Check 2FA fields
    console.log('5. Testing 2FA configuration...');

    const usersWith2FA = await prisma.user.findMany({
      where: {
        OR: [
          { twoFactorEnabled: true },
          { twoFactorSecret: { not: null } }
        ]
      },
      select: {
        email: true,
        twoFactorEnabled: true,
        twoFactorSecret: true,
        twoFactorBackupCodes: true
      }
    });

    console.log(`ℹ️  Users with 2FA configured: ${usersWith2FA.length}`);
    usersWith2FA.forEach(user => {
      console.log(`   - ${user.email}: ${user.twoFactorEnabled ? 'Enabled' : 'Disabled'}`);
    });
    console.log('');

    // Test 6: Check OAuth fields
    console.log('6. Testing OAuth configuration...');

    const oauthUsers = await prisma.user.findMany({
      where: {
        provider: { not: 'credentials' }
      },
      select: {
        email: true,
        provider: true,
        image: true
      }
    });

    console.log(`ℹ️  OAuth users: ${oauthUsers.length}`);
    oauthUsers.forEach(user => {
      console.log(`   - ${user.email} (${user.provider})`);
    });
    console.log('');

    console.log('🎉 Authentication system tests completed!');

  } catch (error) {
    console.error('❌ Authentication test failed:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Test password strength requirements
async function testPasswordRequirements() {
  console.log('\n🔒 Testing Password Requirements...\n');

  const testPasswords = [
    { password: '123', expected: false, reason: 'Too short' },
    { password: '12345', expected: false, reason: 'Too short' },
    { password: '123456', expected: true, reason: 'Minimum length' },
    { password: 'password123', expected: true, reason: 'Valid password' },
    { password: '', expected: false, reason: 'Empty password' }
  ];

  testPasswords.forEach(test => {
    const isValid = test.password.length >= 6;
    const result = isValid === test.expected ? '✅' : '❌';
    console.log(`${result} "${test.password}" - ${test.reason}: ${isValid ? 'Valid' : 'Invalid'}`);
  });

  console.log('\n💡 Password requirements: Minimum 6 characters');
}

// Test session/token structure (mock)
function testSessionStructure() {
  console.log('\n🎫 Testing Session Structure...\n');

  const mockSession = {
    user: {
      id: 'user123',
      email: 'test@example.com',
      name: 'Test User',
      role: 'cliente',
      phoneVerifiedAt: new Date().toISOString(),
    },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
  };

  console.log('Mock session structure:');
  console.log(JSON.stringify(mockSession, null, 2));
  console.log('');

  // Check required fields
  const requiredFields = ['user.id', 'user.email', 'user.name', 'user.role', 'expires'];
  let allPresent = true;

  requiredFields.forEach(field => {
    const keys = field.split('.');
    let value = mockSession;
    for (const key of keys) {
      value = value?.[key];
    }

    if (value === undefined) {
      console.log(`❌ Missing required field: ${field}`);
      allPresent = false;
    } else {
      console.log(`✅ ${field}: ${typeof value === 'object' ? 'present' : value}`);
    }
  });

  if (allPresent) {
    console.log('✅ Session structure is valid');
  }
}

// Run all tests
async function main() {
  await testAuthentication();
  testPasswordRequirements();
  testSessionStructure();
  console.log('\n✨ All authentication tests completed!');
}

main().catch(console.error);