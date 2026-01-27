# Guía de Integración Verifik

## Configuración

Para habilitar validación DNI con Verifik, necesitas:

### 1. Obtener Credenciales
Contacta a Verifik (https://verifik.com) y solicita:
- API Key
- Secret Key
- Documentación de API

### 2. Configurar Variables de Entorno

En tu proyecto local (`.env.local`):
```bash
VERIFIK_ENABLED=false
VERIFIK_API_KEY=tu_api_key_aqui
VERIFIK_SECRET=tu_secret_aqui
```

En Vercel, añade en Project Settings → Environment Variables:
```
VERIFIK_ENABLED=true
VERIFIK_API_KEY=<tu_api_key>
VERIFIK_SECRET=<tu_secret>
```

### 3. Desplegar
```bash
cd alquiler-motos
npm run build
npx vercel --prod
```

## Endpoints Disponibles

### Validar DNI (Solo Verificación)
```bash
POST /api/verificaciones/validar-dni
Content-Type: application/json

{
  "dni": "12345678",
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "checkOnly": true
}
```

**Respuesta exitosa:**
```json
{
  "valid": true,
  "verified": true,
  "riskLevel": "LOW",
  "message": "DNI válido y verificado"
}
```

**Respuesta con riesgo:**
```json
{
  "valid": false,
  "error": "DNI reporta riesgo alto. Contactar a administrador.",
  "riskLevel": "HIGH"
}
```

### Validar y Crear Cliente
```bash
POST /api/verificaciones/validar-dni
Content-Type: application/json

{
  "dni": "12345678",
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "checkOnly": false
}
```

**Respuesta:** Crea el cliente si DNI es válido (status 201)

## Integración en Retool

### Query de Validación
```javascript
// Validar DNI antes de crear cliente
const response = await fetch(
  'https://alquiler-motos.vercel.app/api/verificaciones/validar-dni',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': '2961354027da23c780e5580ee4eb9ce500e140bdf9157696a6a2684eca412a18'
    },
    body: JSON.stringify({
      dni: dniInput.value,
      nombre: nombreInput.value,
      email: emailInput.value,
      checkOnly: true
    })
  }
);

const result = await response.json();

// Mostrar resultado
if (result.valid) {
  showSuccess(`DNI verificado - Riesgo: ${result.riskLevel}`);
  // Habilitar crear cliente
  crearClienteButton.disabled = false;
} else {
  showError(result.error);
  crearClienteButton.disabled = true;
}
```

## Niveles de Riesgo

| Nivel | Significado | Acción |
|-------|------------|--------|
| **LOW** | Sin antecedentes | ✅ Proceder |
| **MEDIUM** | Pequeños antecedentes | ⚠️ Revisar |
| **HIGH** | Sanciones/Fraude | ❌ Rechazar |

## Fallback (Sin Verifik)

Si Verifik no está configurado o está down:
- ✅ Se valida solo formato DNI (8 dígitos)
- ✅ Se verifica duplicados en BD
- ❌ No se valida contra RENAPER/Antecedentes
- ⚠️ Se marca como `riskLevel: 'LOW'` (permisivo)

Para producción recomendamos tener Verifik habilitado.

## Alternativa: AFIP

Si Verifik no es opción, usa AFIP (ya configurado):

```typescript
import { afip } from '@/lib/afip';

const personData = await afip?.getPersonData(parseInt(dni));
// Valida contra RENAPER
```

## Soporte

- Documentación Verifik: https://verifik.com
- Issues: Crear en repositorio con tag `[verifik]`
