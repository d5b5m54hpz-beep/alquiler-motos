#!/bin/bash

# 🚀 Backend Testing Suite for Alquiler Motos
# This script performs comprehensive testing of the backend functionality

set -e

echo "🧪 Starting Backend Testing Suite..."
echo "====================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BASE_URL="http://localhost:3000"
TEST_USER_EMAIL="admin@example.com"
TEST_USER_PASSWORD="admin123"

# Helper functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

test_endpoint() {
    local method=$1
    local url=$2
    local expected_status=${3:-200}
    local description=$4
    local auth_header=${5:-""}

    log_info "Testing $description ($method $url)"

    if [ -n "$auth_header" ]; then
        response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$url" -H "Authorization: Bearer $auth_header" 2>/dev/null)
    else
        response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$url" 2>/dev/null)
    fi

    status_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n -1)

    if [ "$status_code" -eq "$expected_status" ]; then
        log_success "$description passed (Status: $status_code)"
        return 0
    else
        log_error "$description failed (Expected: $expected_status, Got: $status_code)"
        echo "Response: $body"
        return 1
    fi
}

# Test 1: Build Check
echo ""
log_info "1️⃣ Testing Build Process..."
if npm run build > /dev/null 2>&1; then
    log_success "Build completed successfully"
else
    log_error "Build failed"
    exit 1
fi

# Test 2: Server Startup
echo ""
log_info "2️⃣ Testing Server Startup..."
log_warning "Please ensure the dev server is running on port 3000"
log_warning "Run 'npm run dev' in another terminal if not already running"
read -p "Press Enter when server is ready, or Ctrl+C to skip server tests..."

# Test 3: Basic Health Check
echo ""
log_info "3️⃣ Testing Basic Connectivity..."
if curl -s "$BASE_URL" > /dev/null; then
    log_success "Server is responding"
else
    log_error "Server is not responding on $BASE_URL"
    exit 1
fi

# Test 4: Public Endpoints
echo ""
log_info "4️⃣ Testing Public Endpoints..."

# Test public motos endpoint
test_endpoint "GET" "/api/public/motos" 200 "Public motorcycles list"

# Test public alertas endpoint
test_endpoint "GET" "/api/public/alertas" 200 "Public alerts list"

# Test 5: Authentication Endpoints
echo ""
log_info "5️⃣ Testing Authentication Endpoints..."

# Test login page access
test_endpoint "GET" "/login" 200 "Login page access"

# Test admin login page access
test_endpoint "GET" "/login-admin" 200 "Admin login page access"

# Test registration page access
test_endpoint "GET" "/registro" 200 "Registration page access"

# Test 6: API Security (should fail without auth)
echo ""
log_info "6️⃣ Testing API Security..."

# These should return 401 or 403 without authentication
test_endpoint "GET" "/api/usuarios" 401 "Protected users endpoint without auth"
test_endpoint "GET" "/api/clientes" 401 "Protected clients endpoint without auth"
test_endpoint "GET" "/api/motos" 401 "Protected motorcycles endpoint without auth"
test_endpoint "GET" "/api/contratos" 401 "Protected contracts endpoint without auth"

# Test 7: Admin Routes Protection
echo ""
log_info "7️⃣ Testing Admin Route Protection..."

# These should redirect or return 401/403 without admin auth
test_endpoint "GET" "/admin" 401 "Admin dashboard without auth"
test_endpoint "GET" "/api/admin" 401 "Admin API without auth"

# Test 8: Database Connection (via API)
echo ""
log_info "8️⃣ Testing Database Connectivity..."

# Try to access an endpoint that requires DB connection
if curl -s "$BASE_URL/api/public/motos" | grep -q "error"; then
    log_error "Database connection might have issues"
else
    log_success "Database appears to be connected"
fi

# Test 9: Error Handling
echo ""
log_info "9️⃣ Testing Error Handling..."

# Test invalid endpoint
test_endpoint "GET" "/api/nonexistent" 404 "Invalid endpoint handling"

# Test invalid method
test_endpoint "POST" "/api/public/motos" 405 "Invalid method handling"

# Test 10: Performance Check
echo ""
log_info "🔟 Testing Performance..."

start_time=$(date +%s%3N)
response=$(curl -s -w "%{time_total}" -o /dev/null "$BASE_URL/api/public/motos")
end_time=$(date +%s%3N)

# Extract response time from curl output (last line)
response_time=$(echo "$response" | tail -n1 | awk '{print int($1 * 1000)}') # Convert to milliseconds

if [ "$response_time" -lt 1000 ]; then
    log_success "Response time: ${response_time}ms (Good)"
else
    log_warning "Response time: ${response_time}ms (Slow - consider optimization)"
fi

# Test 11: Authentication Flow (Manual Test)
echo ""
log_info "1️⃣1️⃣ Authentication Flow Test (Manual)"
echo "Please manually test the following:"
echo "1. Visit $BASE_URL/login"
echo "2. Try logging in with: $TEST_USER_EMAIL / $TEST_USER_PASSWORD"
echo "3. Check if redirect works and session is maintained"
echo "4. Test accessing protected routes after login"
echo "5. Test logout functionality"

# Test 12: CORS Headers
echo ""
log_info "1️⃣2️⃣ Testing CORS Headers..."

cors_response=$(curl -s -I "$BASE_URL/api/public/motos" | grep -i "access-control" | wc -l)
if [ "$cors_response" -gt 0 ]; then
    log_success "CORS headers are present"
else
    log_warning "CORS headers not detected (may be okay for same-origin)"
fi

# Summary
echo ""
echo "====================================="
log_success "Backend Testing Suite Completed!"
echo ""
echo "📋 Next Steps:"
echo "1. Fix any failed tests above"
echo "2. Test authentication flow manually"
echo "3. Run database migrations if needed: npx prisma db push"
echo "4. Test payment integration with MercadoPago"
echo "5. Test email sending with SendGrid"
echo "6. Verify AFIP integration for invoicing"
echo ""
echo "🔧 Useful Commands:"
echo "• Start dev server: npm run dev"
echo "• Run build: npm run build"
echo "• View logs: Check terminal output"
echo "• Reset database: npx prisma db push --force-reset && npm run seed"