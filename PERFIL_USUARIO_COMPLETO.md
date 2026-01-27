# Sistema Completo de Perfil de Usuario

## Descripción General
Se ha implementado un sistema completo de gestión de perfil de usuario con las siguientes características:

### ✅ Componentes Implementados

#### 1. **Botón de Perfil en el Header** (`src/app/components/UserProfileButton.tsx`)
- Botón circular con inicial del usuario en el navegador
- Dropdown menu que muestra:
  - Nombre completo y email del usuario
  - Opción "Mi Cuenta" que redirige a `/perfil`
  - Botón "Salir" para desconectarse

#### 2. **Página de Perfil** (`src/app/perfil/page.tsx`)
Interfaz profesional con 3 secciones principales:

##### **Sección: Información Personal**
- **Nombre Completo**: Campo editable
- **Email**: Campo deshabilitado (solo lectura) con badge de "Verificado" si `emailVerifiedAt` está poblado
- **Número de Teléfono**: Campo editable con badge de "Verificado" si `phoneVerifiedAt` está poblado
- Botón "Guardar Cambios" para actualizar datos

##### **Sección: Seguridad** (Solo para usuarios con provider "credentials")
- **Cambiar Contraseña**: 
  - Solicita contraseña actual para validación
  - Campos para nueva contraseña y confirmación
  - Validación de concordancia y mínimo 6 caracteres
  - Mensaje de éxito/error

##### **Sección: Verificación de Dos Pasos (2FA)**
- **Si NO está activado**:
  - Explicación de beneficios
  - Botón para iniciar configuración
  - Genera código QR basado en estándar TOTP
  - Opción para ingresar código manualmente
  - Verificación con código de 6 dígitos
  - Generación de códigos de respaldo

- **Si YA está activado**:
  - Badge "✓ Verificación de dos pasos está activada"
  - Mensaje confirmatorio

### 📡 API Endpoints Creados

#### **GET /api/usuarios/perfil**
Obtiene el perfil completo del usuario autenticado.
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "emailVerifiedAt": "2024-01-27T10:30:00Z",
  "name": "Juan Pérez",
  "phone": "+54 9 11 23456789",
  "phoneVerifiedAt": "2024-01-26T15:45:00Z",
  "twoFactorEnabled": false,
  "provider": "credentials"
}
```

#### **PUT /api/usuarios/perfil**
Actualiza nombre y teléfono del usuario.
```json
Request: { "name": "Juan Carlos Pérez", "phone": "+54 9 11 98765432" }
Response: { /* perfil actualizado */ }
```

#### **POST /api/usuarios/perfil/cambiar-password**
Cambia la contraseña del usuario (requiere validación de contraseña actual).
```json
Request: {
  "currentPassword": "antigua_contraseña",
  "newPassword": "nueva_contraseña_segura"
}
Response: { "success": true, "message": "Contraseña actualizada" }
```

#### **POST /api/usuarios/perfil/2fa/setup**
Genera código secreto y QR para iniciar configuración de 2FA.
```json
Response: {
  "secret": "JBSWY3DPEBLW64TMMQ======",
  "qrCode": "data:image/png;base64,...",
  "otpauth_url": "otpauth://totp/Alquiler%20Motos..."
}
```

#### **POST /api/usuarios/perfil/2fa/verify**
Verifica el código 2FA proporcionado y activa la verificación de dos pasos.
```json
Request: {
  "secret": "JBSWY3DPEBLW64TMMQ======",
  "token": "123456"
}
Response: {
  "success": true,
  "message": "2FA activado exitosamente",
  "backupCodes": ["ABC12345", "DEF67890", ...]
}
```

### 🗄️ Cambios en la Base de Datos

**Nuevos campos en modelo User (Prisma)**:
```prisma
model User {
  // ... campos existentes ...
  emailVerifiedAt  DateTime?   // Fecha de verificación del email
  twoFactorEnabled Boolean     @default(false)  // Estado de 2FA
  twoFactorSecret  String?     // Código secreto TOTP
  twoFactorBackupCodes String[]  // Códigos de respaldo
}
```

### 🔐 Características de Seguridad

1. **Validación de Sesión**: Todos los endpoints verifican que el usuario esté autenticado
2. **Bcrypt Hashing**: Las contraseñas se hashean con bcrypt (10 rounds)
3. **TOTP (Time-based One-Time Password)**:
   - Utiliza estándar RFC 6238
   - Ventana de tiempo de ±2 períodos (60 segundos)
   - Compatible con Google Authenticator, Microsoft Authenticator, Authy, etc.
4. **Validación de Email y Teléfono**: Sistema de badges para indicar verificación
5. **Códigos de Respaldo**: Se generan 10 códigos de respaldo para acceso de emergencia

### 🎨 Interfaz de Usuario

**Diseño Profesional**:
- Gradiente de color principal: #667eea → #764ba2
- Paleta de colores consistente con el resto de la aplicación
- Badges de verificación con fondo verde y checkmark
- Mensajes de éxito/error con colores distintivos
- Inputs con estados de hover y focus
- Responsive y accesible

**Flujos Intuitivos**:
1. **Actualizar Perfil**: Cambiar nombre o teléfono en tiempo real
2. **Cambiar Contraseña**: Verificación de contraseña actual antes de actualizar
3. **Activar 2FA**: 
   - Generar QR
   - Copiar código manual
   - Verificar con autenticador
   - Descargar códigos de respaldo

### 📦 Dependencias Agregadas

```bash
npm install speakeasy qrcode bcryptjs
```

- **speakeasy**: Generación y verificación de TOTP
- **qrcode**: Generación de códigos QR en base64
- **bcryptjs**: Hashing seguro de contraseñas

### ✨ Próximos Pasos Sugeridos

1. **Verificación de Email**: Implementar endpoint para enviar email de confirmación
2. **Verificación de Teléfono**: Implementar verificación por SMS/WhatsApp
3. **Administración de Sesiones**: Permitir cerrar sesiones remotas
4. **Historial de Seguridad**: Registrar cambios de seguridad importantes
5. **Recuperación de Cuenta**: Implementar flujo de recuperación por email
6. **Integración con OAuth**: Permitir cambio de proveedor (credenciales a Google, etc.)

### 🧪 Pruebas Recomendadas

```bash
# Login como cliente
# Navegar a /perfil
# Editar nombre y teléfono → Guardar Cambios
# Cambiar contraseña
# Activar 2FA → Escanear QR → Verificar código → Confirmar
# Verificar que 2FA aparece como activado
```

## Estructura de Archivos

```
src/app/
├── components/
│   └── UserProfileButton.tsx          # Botón dropdown de perfil
├── perfil/
│   └── page.tsx                       # Página de perfil completa
└── api/usuarios/perfil/
    ├── route.ts                       # GET/PUT perfil
    ├── cambiar-password/
    │   └── route.ts                   # POST cambiar contraseña
    └── 2fa/
        ├── setup/
        │   └── route.ts               # POST setup 2FA
        └── verify/
            └── route.ts               # POST verify 2FA
```

## Estado: ✅ COMPLETADO

Todos los componentes, páginas y API endpoints han sido implementados exitosamente.
La compilación pasó sin errores y el servidor de desarrollo está corriendo.
