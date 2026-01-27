#!/bin/bash

# 🧪 Script de Prueba API - Sistema de Perfil de Usuario
# Uso: ./test-profile-api.sh

echo "🧪 INICIANDO PRUEBAS DEL SISTEMA DE PERFIL"
echo "============================================="
echo ""

API_BASE="http://localhost:3000"
HEADERS="Content-Type: application/json"

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Helper function to print test results
test_api() {
  local name=$1
  local method=$2
  local endpoint=$3
  local data=$4
  local expected_status=$5

  echo -e "${BLUE}📋 Prueba: $name${NC}"
  echo "   Endpoint: $method $endpoint"
  
  if [ -z "$data" ]; then
    response=$(curl -s -w "\n%{http_code}" -X $method "$API_BASE$endpoint" \
      -H "$HEADERS" \
      -H "Cookie: next-auth.session-token=test")
  else
    response=$(curl -s -w "\n%{http_code}" -X $method "$API_BASE$endpoint" \
      -H "$HEADERS" \
      -H "Cookie: next-auth.session-token=test" \
      -d "$data")
  fi

  # Extract status code and body
  http_code=$(echo "$response" | tail -n 1)
  body=$(echo "$response" | sed '$d')

  if [ "$http_code" = "$expected_status" ]; then
    echo -e "   ${GREEN}✅ Status: $http_code (Esperado: $expected_status)${NC}"
    echo "   Respuesta: $(echo $body | head -c 100)..."
    ((TESTS_PASSED++))
  else
    echo -e "   ${RED}❌ Status: $http_code (Esperado: $expected_status)${NC}"
    echo "   Respuesta: $(echo $body | head -c 100)..."
    ((TESTS_FAILED++))
  fi
  echo ""
}

echo -e "${YELLOW}PRUEBAS SIN AUTENTICACIÓN${NC}"
echo "=================================="

# Test 1: GET perfil sin token
test_api "GET /api/usuarios/perfil sin sesión" "GET" "/api/usuarios/perfil" "" "401"

# Test 2: PUT perfil sin token
test_api "PUT /api/usuarios/perfil sin sesión" "PUT" "/api/usuarios/perfil" '{"name":"Test"}' "401"

# Test 3: POST cambiar password sin token
test_api "POST cambiar-password sin sesión" "POST" "/api/usuarios/perfil/cambiar-password" \
  '{"currentPassword":"test","newPassword":"test123"}' "401"

# Test 4: POST 2FA setup sin token
test_api "POST 2fa/setup sin sesión" "POST" "/api/usuarios/perfil/2fa/setup" "" "401"

# Test 5: POST 2FA verify sin token
test_api "POST 2fa/verify sin sesión" "POST" "/api/usuarios/perfil/2fa/verify" \
  '{"secret":"test","token":"123456"}' "401"

echo -e "${YELLOW}VERIFICACIÓN DE RUTAS${NC}"
echo "=================================="

# Test 6: Verificar que la página /perfil existe
response=$(curl -s -w "\n%{http_code}" -X GET "$API_BASE/perfil" \
  -H "Cookie: next-auth.session-token=test")
http_code=$(echo "$response" | tail -n 1)

echo -e "${BLUE}📋 Prueba: GET /perfil (página)${NC}"
if [ "$http_code" = "200" ] || [ "$http_code" = "307" ]; then
  echo -e "   ${GREEN}✅ Página /perfil está disponible (Status: $http_code)${NC}"
  ((TESTS_PASSED++))
else
  echo -e "   ${RED}❌ Página /perfil no encontrada (Status: $http_code)${NC}"
  ((TESTS_FAILED++))
fi
echo ""

# Test 7: Verificar que existe UserProfileButton en header
echo -e "${BLUE}📋 Prueba: Componente UserProfileButton existe${NC}"
if [ -f "src/app/components/UserProfileButton.tsx" ]; then
  echo -e "   ${GREEN}✅ Archivo UserProfileButton.tsx existe${NC}"
  ((TESTS_PASSED++))
else
  echo -e "   ${RED}❌ Archivo UserProfileButton.tsx no encontrado${NC}"
  ((TESTS_FAILED++))
fi
echo ""

# Test 8: Verificar que la página de perfil existe
echo -e "${BLUE}📋 Prueba: Página perfil/page.tsx existe${NC}"
if [ -f "src/app/perfil/page.tsx" ]; then
  echo -e "   ${GREEN}✅ Archivo perfil/page.tsx existe${NC}"
  ((TESTS_PASSED++))
else
  echo -e "   ${RED}❌ Archivo perfil/page.tsx no encontrado${NC}"
  ((TESTS_FAILED++))
fi
echo ""

# Test 9: Verificar endpoints de API
echo -e "${BLUE}📋 Prueba: API endpoint /api/usuarios/perfil existe${NC}"
if [ -f "src/app/api/usuarios/perfil/route.ts" ]; then
  echo -e "   ${GREEN}✅ Archivo perfil/route.ts existe${NC}"
  ((TESTS_PASSED++))
else
  echo -e "   ${RED}❌ Archivo perfil/route.ts no encontrado${NC}"
  ((TESTS_FAILED++))
fi
echo ""

echo -e "${BLUE}📋 Prueba: API endpoint cambiar-password existe${NC}"
if [ -f "src/app/api/usuarios/perfil/cambiar-password/route.ts" ]; then
  echo -e "   ${GREEN}✅ Archivo cambiar-password/route.ts existe${NC}"
  ((TESTS_PASSED++))
else
  echo -e "   ${RED}❌ Archivo cambiar-password/route.ts no encontrado${NC}"
  ((TESTS_FAILED++))
fi
echo ""

echo -e "${BLUE}📋 Prueba: API endpoint 2fa/setup existe${NC}"
if [ -f "src/app/api/usuarios/perfil/2fa/setup/route.ts" ]; then
  echo -e "   ${GREEN}✅ Archivo 2fa/setup/route.ts existe${NC}"
  ((TESTS_PASSED++))
else
  echo -e "   ${RED}❌ Archivo 2fa/setup/route.ts no encontrado${NC}"
  ((TESTS_FAILED++))
fi
echo ""

echo -e "${BLUE}📋 Prueba: API endpoint 2fa/verify existe${NC}"
if [ -f "src/app/api/usuarios/perfil/2fa/verify/route.ts" ]; then
  echo -e "   ${GREEN}✅ Archivo 2fa/verify/route.ts existe${NC}"
  ((TESTS_PASSED++))
else
  echo -e "   ${RED}❌ Archivo 2fa/verify/route.ts no encontrado${NC}"
  ((TESTS_FAILED++))
fi
echo ""

# Test 10: Verificar schema Prisma tiene 2FA fields
echo -e "${BLUE}📋 Prueba: Schema Prisma tiene campos 2FA${NC}"
if grep -q "twoFactorEnabled" "prisma/schema.prisma" && \
   grep -q "twoFactorSecret" "prisma/schema.prisma" && \
   grep -q "twoFactorBackupCodes" "prisma/schema.prisma"; then
  echo -e "   ${GREEN}✅ Schema Prisma contiene campos 2FA${NC}"
  ((TESTS_PASSED++))
else
  echo -e "   ${RED}❌ Schema Prisma no tiene campos 2FA${NC}"
  ((TESTS_FAILED++))
fi
echo ""

# Test 11: Verificar dependencias instaladas
echo -e "${BLUE}📋 Prueba: Dependencias de 2FA instaladas${NC}"
if grep -q "speakeasy" "package.json" && \
   grep -q "qrcode" "package.json" && \
   grep -q "bcryptjs" "package.json"; then
  echo -e "   ${GREEN}✅ Dependencias speakeasy, qrcode, bcryptjs están instaladas${NC}"
  ((TESTS_PASSED++))
else
  echo -e "   ${RED}❌ Falta alguna dependencia${NC}"
  ((TESTS_FAILED++))
fi
echo ""

# Final summary
echo "============================================="
echo -e "${YELLOW}RESUMEN DE PRUEBAS${NC}"
echo "============================================="
echo -e "${GREEN}✅ Pasadas: $TESTS_PASSED${NC}"
echo -e "${RED}❌ Fallidas: $TESTS_FAILED${NC}"

if [ $TESTS_FAILED -eq 0 ]; then
  echo -e "${GREEN}🎉 TODAS LAS PRUEBAS PASARON!${NC}"
  exit 0
else
  echo -e "${RED}⚠️  ALGUNAS PRUEBAS FALLARON${NC}"
  exit 1
fi
