#!/bin/bash

# 🚀 Backend Login Testing Script
# Run with: ./test-login.sh

echo "🔐 Testing Backend Login Functionality..."
echo "=========================================="

BASE_URL="http://localhost:3000"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="admin123"
CLIENT_EMAIL="juan@example.com"
CLIENT_PASSWORD="cliente123"

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

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Test 1: Check if server is running
echo ""
log_info "1. Checking if server is running..."
if curl -s "$BASE_URL" > /dev/null 2>&1; then
    log_success "Server is responding on $BASE_URL"
else
    log_error "Server is not responding on $BASE_URL"
    log_warning "Make sure to run 'npm run dev' first"
    exit 1
fi

# Test 2: Test public endpoints (no auth required)
echo ""
log_info "2. Testing public endpoints..."
if curl -s "$BASE_URL/api/public/motos" | grep -q "marca\|modelo\|patente"; then
    log_success "Public motorcycles endpoint working"
else
    log_error "Public motorcycles endpoint failed"
fi

if curl -s "$BASE_URL/api/public/alertas" | grep -q "tipo\|mensaje"; then
    log_success "Public alerts endpoint working"
else
    log_error "Public alerts endpoint failed"
fi

# Test 3: Test protected endpoints (should fail without auth)
echo ""
log_info "3. Testing protected endpoints (should be blocked)..."
response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/usuarios")
if [ "$response" -eq 401 ] || [ "$response" -eq 403 ]; then
    log_success "Protected endpoint correctly blocked (HTTP $response)"
else
    log_error "Protected endpoint should be blocked but got HTTP $response"
fi

# Test 4: Test NextAuth session endpoint
echo ""
log_info "4. Testing NextAuth session endpoint..."
session_response=$(curl -s "$BASE_URL/api/auth/session")
if echo "$session_response" | grep -q '"user":null'; then
    log_success "Session endpoint working (no active session as expected)"
else
    log_info "Session response: $session_response"
fi

# Test 5: Test login page access
echo ""
log_info "5. Testing login page access..."
login_page=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/login")
if [ "$login_page" -eq 200 ]; then
    log_success "Login page accessible"
else
    log_error "Login page not accessible (HTTP $login_page)"
fi

admin_login_page=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/login-admin")
if [ "$admin_login_page" -eq 200 ]; then
    log_success "Admin login page accessible"
else
    log_error "Admin login page not accessible (HTTP $admin_login_page)"
fi

# Test 6: Test admin routes protection
echo ""
log_info "6. Testing admin route protection..."
admin_dashboard=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/admin")
if [ "$admin_dashboard" -eq 401 ] || [ "$admin_dashboard" -eq 403 ]; then
    log_success "Admin dashboard correctly protected (HTTP $admin_dashboard)"
else
    log_error "Admin dashboard should be protected but got HTTP $admin_dashboard"
fi

# Test 7: Test API route protection
echo ""
log_info "7. Testing API route protection..."
protected_api=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/admin")
if [ "$protected_api" -eq 401 ] || [ "$protected_api" -eq 403 ]; then
    log_success "Admin API correctly protected (HTTP $protected_api)"
else
    log_error "Admin API should be protected but got HTTP $protected_api"
fi

# Test 8: Instructions for manual testing
echo ""
log_info "8. Manual Testing Instructions:"
echo "   🌐 Open your browser and test these URLs:"
echo "      • Login page: $BASE_URL/login"
echo "      • Admin login: $BASE_URL/login-admin"
echo "      • Registration: $BASE_URL/registro"
echo ""
echo "   👤 Test these credentials:"
echo "      • Admin: $ADMIN_EMAIL / $ADMIN_PASSWORD"
echo "      • Client: $CLIENT_EMAIL / $CLIENT_PASSWORD"
echo ""
echo "   🧪 Test these protected routes after login:"
echo "      • Admin dashboard: $BASE_URL/admin"
echo "      • User profile: $BASE_URL/perfil"

# Test 9: Environment check
echo ""
log_info "9. Environment Configuration Check:"
if [ -f ".env.local" ]; then
    log_success ".env.local file exists"
    if grep -q "NEXTAUTH_SECRET" .env.local && grep -q "DATABASE_URL" .env.local; then
        log_success "Required environment variables are set"
    else
        log_warning "Some required environment variables may be missing"
    fi
else
    log_error ".env.local file not found - create it from .env.example"
fi

echo ""
echo "=========================================="
log_success "Login testing completed!"
echo ""
echo "📋 Next Steps:"
echo "1. If tests failed, check that 'npm run dev' is running"
echo "2. Verify your .env.local configuration"
echo "3. Run 'npm run seed' if database needs test data"
echo "4. Test manual login through the browser"
echo "5. Check server logs for any error messages"
echo ""
echo "🔧 Useful Commands:"
echo "• Start server: npm run dev"
echo "• View logs: Check terminal output"
echo "• Reset DB: npx prisma db push --force-reset && npm run seed"
echo "• Full tests: npm run test:all"