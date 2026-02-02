// 🔧 Environment Configuration Checker
// Run with: node check-env.js

const fs = require('fs');
const path = require('path');

function checkEnvironment() {
  console.log('🔧 Checking Environment Configuration...\n');

  const envPath = path.join(__dirname, '.env.local');
  const envExamplePath = path.join(__dirname, '.env.example');

  // Check if .env.local exists
  if (!fs.existsSync(envPath)) {
    console.log('❌ .env.local file not found');
    console.log('💡 Create it by copying .env.example: cp .env.example .env.local');
    return false;
  }

  console.log('✅ .env.local file exists');

  // Read environment variables
  require('dotenv').config({ path: envPath });

  const requiredVars = [
    { name: 'DATABASE_URL', description: 'PostgreSQL database connection string' },
    { name: 'NEXTAUTH_SECRET', description: 'NextAuth.js secret key' },
    { name: 'NEXTAUTH_URL', description: 'Application base URL' },
  ];

  const optionalVars = [
    { name: 'GOOGLE_CLIENT_ID', description: 'Google OAuth client ID' },
    { name: 'GOOGLE_CLIENT_SECRET', description: 'Google OAuth client secret' },
    { name: 'APPLE_CLIENT_ID', description: 'Apple OAuth client ID' },
    { name: 'APPLE_CLIENT_SECRET', description: 'Apple OAuth client secret' },
    { name: 'FACEBOOK_CLIENT_ID', description: 'Facebook OAuth client ID' },
    { name: 'FACEBOOK_CLIENT_SECRET', description: 'Facebook OAuth client secret' },
    { name: 'MERCADOPAGO_ACCESS_TOKEN', description: 'MercadoPago access token' },
    { name: 'SENDGRID_API_KEY', description: 'SendGrid API key' },
    { name: 'AFIP_CERT', description: 'AFIP certificate path' },
    { name: 'AFIP_KEY', description: 'AFIP private key path' },
    { name: 'AFIP_CUIT', description: 'AFIP CUIT number' },
    { name: 'RETOOL_API_KEY', description: 'Retool integration key' },
  ];

  let allRequiredPresent = true;
  let warnings = [];

  console.log('\n📋 Required Environment Variables:');
  requiredVars.forEach(({ name, description }) => {
    const value = process.env[name];
    if (!value || value.trim() === '') {
      console.log(`❌ ${name}: Missing - ${description}`);
      allRequiredPresent = false;
    } else if (value.includes('your-') || value.includes('...') || value.includes('CHANGE_ME')) {
      console.log(`⚠️  ${name}: Has placeholder value - ${description}`);
      warnings.push(`${name} appears to have a placeholder value`);
    } else {
      console.log(`✅ ${name}: Set - ${description}`);
    }
  });

  console.log('\n📋 Optional Environment Variables:');
  optionalVars.forEach(({ name, description }) => {
    const value = process.env[name];
    if (!value || value.trim() === '') {
      console.log(`ℹ️  ${name}: Not set - ${description}`);
    } else if (value.includes('your-') || value.includes('...') || value.includes('CHANGE_ME')) {
      console.log(`⚠️  ${name}: Has placeholder value - ${description}`);
      warnings.push(`${name} appears to have a placeholder value`);
    } else {
      console.log(`✅ ${name}: Set - ${description}`);
    }
  });

  // Additional checks
  console.log('\n🔍 Additional Configuration Checks:');

  // Database URL format check
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl) {
    if (dbUrl.startsWith('postgresql://') || dbUrl.startsWith('postgres://')) {
      console.log('✅ DATABASE_URL: Valid PostgreSQL format');
    } else {
      console.log('❌ DATABASE_URL: Invalid format (should start with postgresql://)');
      allRequiredPresent = false;
    }
  }

  // NextAuth URL format check
  const nextAuthUrl = process.env.NEXTAUTH_URL;
  if (nextAuthUrl) {
    try {
      new URL(nextAuthUrl);
      console.log('✅ NEXTAUTH_URL: Valid URL format');
    } catch {
      console.log('❌ NEXTAUTH_URL: Invalid URL format');
      allRequiredPresent = false;
    }
  }

  // NextAuth secret strength check
  const nextAuthSecret = process.env.NEXTAUTH_SECRET;
  if (nextAuthSecret && nextAuthSecret.length < 32) {
    console.log('⚠️  NEXTAUTH_SECRET: Should be at least 32 characters for security');
    warnings.push('NEXTAUTH_SECRET is shorter than recommended');
  }

  console.log('\n📊 Summary:');

  if (allRequiredPresent) {
    console.log('✅ All required environment variables are configured');
  } else {
    console.log('❌ Some required environment variables are missing or invalid');
  }

  if (warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    warnings.forEach(warning => console.log(`   - ${warning}`));
  }

  console.log('\n💡 Next Steps:');
  if (!allRequiredPresent) {
    console.log('1. Fill in all required environment variables in .env.local');
    console.log('2. Use proper values, not placeholders');
    console.log('3. Restart the development server after changes');
  } else {
    console.log('1. Run the application: npm run dev');
    console.log('2. Test the setup with: ./test-backend.sh');
    console.log('3. Check database connection: node test-db.js');
  }

  return allRequiredPresent;
}

// Check if .env.example exists
function checkEnvExample() {
  const envExamplePath = path.join(__dirname, '.env.example');

  if (!fs.existsSync(envExamplePath)) {
    console.log('⚠️  .env.example file not found - consider creating one for reference');
  } else {
    console.log('✅ .env.example file exists for reference');
  }
}

// Check package.json scripts
function checkPackageScripts() {
  const packagePath = path.join(__dirname, 'package.json');

  if (!fs.existsSync(packagePath)) {
    console.log('❌ package.json not found');
    return;
  }

  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const scripts = packageJson.scripts || {};

  const requiredScripts = ['dev', 'build', 'start', 'lint'];
  const optionalScripts = ['seed'];

  console.log('\n📦 Package.json Scripts Check:');

  requiredScripts.forEach(script => {
    if (scripts[script]) {
      console.log(`✅ ${script}: Available`);
    } else {
      console.log(`❌ ${script}: Missing`);
    }
  });

  optionalScripts.forEach(script => {
    if (scripts[script]) {
      console.log(`✅ ${script}: Available (optional)`);
    } else {
      console.log(`ℹ️  ${script}: Not available (optional)`);
    }
  });
}

// Run all checks
function main() {
  checkEnvExample();
  const envOk = checkEnvironment();
  checkPackageScripts();

  console.log('\n' + '='.repeat(50));
  if (envOk) {
    console.log('🎉 Environment configuration looks good!');
  } else {
    console.log('⚠️  Please fix the configuration issues above');
  }
  console.log('='.repeat(50));
}

main();