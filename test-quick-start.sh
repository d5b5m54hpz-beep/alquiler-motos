#!/bin/bash

# 🚀 Quick Start Backend Testing
# Run this script to verify everything is working

echo "🔥 QUICK START BACKEND TESTING"
echo "=============================="

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

BASE_URL="http://localhost:3000"

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

echo ""
log_info "Step 1: Checking Environment..."
if [ -f ".env.local" ]; then
    log_success "Environment file exists"
else
    log_error "Missing .env.local file"
    log_warning "Create it from .env.example: cp .env.example .env.local"
    exit 1
fi

echo ""
log_info "Step 2: Checking Database..."
if npm run test:db > /dev/null 2>&1; then
    log_success "Database connection OK"
else
    log_error "Database connection failed"
    log_warning "Run: npx prisma db push && npm run seed"
    exit 1
fi

echo ""
log_info "Step 3: Starting Development Server..."
log_warning "This will start the server in the background"
log_warning "Press Ctrl+C to stop the server when done testing"

npm run dev &
SERVER_PID=$!

# Wait for server to start
sleep 5

echo ""
log_info "Step 4: Testing Server Connectivity..."
if curl -s "$BASE_URL" > /dev/null 2>&1; then
    log_success "Server is running on $BASE_URL"
else
    log_error "Server failed to start"
    kill $SERVER_PID 2>/dev/null
    exit 1
fi

echo ""
log_info "Step 5: Testing Authentication Links..."
if curl -s "$BASE_URL/login" | grep -q "Bienvenido"; then
    log_success "Client login page: $BASE_URL/login"
else
    log_error "Client login page failed"
fi

if curl -s "$BASE_URL/login-admin" | grep -q "Panel de Administración"; then
    log_success "Admin login page: $BASE_URL/login-admin"
else
    log_error "Admin login page failed"
fi

if curl -s "$BASE_URL/registro" | grep -q "Crear cuenta"; then
    log_success "Registration page: $BASE_URL/registro"
else
    log_error "Registration page failed"
fi

echo ""
log_info "Step 6: Testing API Endpoints..."
if curl -s "$BASE_URL/api/public/motos" | grep -q "marca\|modelo"; then
    log_success "Public motorcycles API working"
else
    log_error "Public motorcycles API failed"
fi

if curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/usuarios" | grep -q "401"; then
    log_success "Protected API correctly secured (401)"
else
    log_error "Protected API security check failed"
fi

echo ""
echo "🎉 TESTING COMPLETE!"
echo ""
echo "🌐 OPEN YOUR BROWSER AND TEST:"
echo "   • Client Login: $BASE_URL/login"
echo "   • Admin Login: $BASE_URL/login-admin"
echo "   • Registration: $BASE_URL/registro"
echo ""
echo "👤 TEST CREDENTIALS:"
echo "   • Admin: admin@example.com / admin123"
echo "   • Client: juan@example.com / cliente123"
echo ""
echo "⚠️  PRESS Ctrl+C TO STOP THE SERVER WHEN DONE"

# Wait for user to stop
wait $SERVER_PID