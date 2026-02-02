#!/bin/bash

# 🔍 Development Server Diagnostic Tool
# Run this to diagnose why npm run dev is not working

echo "🔍 DIAGNOSTIC TOOL - Why isn't npm run dev working?"
echo "=================================================="

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

ISSUES_FOUND=0

echo ""
log_info "1. Checking Node.js and npm installation..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    log_success "Node.js installed: $NODE_VERSION"
else
    log_error "Node.js is not installed or not in PATH"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    log_success "npm installed: $NPM_VERSION"
else
    log_error "npm is not installed or not in PATH"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

echo ""
log_info "2. Checking project directory..."
if [ -f "package.json" ]; then
    log_success "package.json exists"
else
    log_error "package.json not found - not in project directory?"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

echo ""
log_info "3. Checking dependencies..."
if [ -d "node_modules" ]; then
    log_success "node_modules directory exists"
    DEP_COUNT=$(find node_modules -maxdepth 1 -type d | wc -l)
    log_info "Found approximately $((DEP_COUNT - 1)) dependencies installed"
else
    log_error "node_modules directory missing - run 'npm install'"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

echo ""
log_info "4. Checking environment configuration..."
if [ -f ".env.local" ]; then
    log_success ".env.local file exists"

    # Check required variables
    if grep -q "DATABASE_URL" .env.local; then
        log_success "DATABASE_URL is configured"
    else
        log_error "DATABASE_URL not found in .env.local"
        ISSUES_FOUND=$((ISSUES_FOUND + 1))
    fi

    if grep -q "NEXTAUTH_SECRET" .env.local; then
        log_success "NEXTAUTH_SECRET is configured"
    else
        log_error "NEXTAUTH_SECRET not found in .env.local"
        ISSUES_FOUND=$((ISSUES_FOUND + 1))
    fi
else
    log_error ".env.local file missing - copy from .env.example"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

echo ""
log_info "5. Checking TypeScript configuration..."
if [ -f "tsconfig.json" ]; then
    log_success "tsconfig.json exists"
else
    log_error "tsconfig.json missing"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

echo ""
log_info "6. Checking Prisma setup..."
if [ -d "prisma" ]; then
    log_success "Prisma directory exists"

    if [ -f "prisma/schema.prisma" ]; then
        log_success "schema.prisma exists"
    else
        log_error "schema.prisma missing"
        ISSUES_FOUND=$((ISSUES_FOUND + 1))
    fi

    if [ -d "node_modules/.prisma" ]; then
        log_success "Prisma client appears to be generated"
    else
        log_warning "Prisma client may not be generated - run 'npx prisma generate'"
    fi
else
    log_error "Prisma directory missing"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

echo ""
log_info "7. Testing basic npm commands..."
if npm --version > /dev/null 2>&1; then
    log_success "npm command works"
else
    log_error "npm command failed"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

echo ""
log_info "8. Checking port 3000 availability..."
if lsof -i :3000 > /dev/null 2>&1; then
    log_warning "Port 3000 is already in use"
    log_info "Process using port 3000:"
    lsof -i :3000 | head -2
    log_warning "Kill the process or use a different port"
else
    log_success "Port 3000 is available"
fi

echo ""
log_info "9. Testing package.json scripts..."
if grep -q '"dev":' package.json; then
    log_success "dev script is defined in package.json"
else
    log_error "dev script not found in package.json"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

echo ""
echo "=================================================="
if [ $ISSUES_FOUND -eq 0 ]; then
    log_success "No issues found! Try running 'npm run dev'"
else
    log_error "Found $ISSUES_FOUND issue(s) that need to be fixed:"
fi

echo ""
echo "🔧 FIXES TO TRY:"
echo ""

if ! command -v node &> /dev/null; then
    echo "• Install Node.js: https://nodejs.org/"
fi

if ! command -v npm &> /dev/null; then
    echo "• npm should come with Node.js"
fi

if [ ! -d "node_modules" ]; then
    echo "• Run: npm install"
fi

if [ ! -f ".env.local" ]; then
    echo "• Run: cp .env.example .env.local"
    echo "• Edit .env.local with your configuration"
fi

if lsof -i :3000 > /dev/null 2>&1; then
    echo "• Kill process on port 3000: lsof -ti:3000 | xargs kill -9"
    echo "• Or run on different port: npm run dev -- -p 3001"
fi

if [ -d "node_modules/.prisma" ]; then
    echo "• Generate Prisma client: npx prisma generate"
fi

echo ""
echo "🚀 AFTER FIXING ISSUES, TRY:"
echo "   npm run dev"
echo ""
echo "📞 STILL HAVING ISSUES?"
echo "   Run: npm run build  (to check for compilation errors)"
echo "   Check the error messages carefully"
echo ""

if [ $ISSUES_FOUND -gt 0 ]; then
    echo "💡 START WITH THE FIRST ISSUE LISTED ABOVE"
fi