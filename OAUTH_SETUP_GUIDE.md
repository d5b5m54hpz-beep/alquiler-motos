# Guía de Configuración OAuth

## 🔵 Google OAuth

### 1. Google Cloud Console
1. Ve a [console.cloud.google.com](https://console.cloud.google.com)
2. Crea un proyecto nuevo o selecciona uno existente
3. En el menú lateral → **APIs & Services** → **Credentials**

### 2. Configurar OAuth Consent Screen
1. Click en **OAuth consent screen**
2. Selecciona **External** → **Create**
3. Completa:
   - **App name**: Alquiler Motos
   - **User support email**: Tu email
   - **Developer contact**: Tu email
4. **Save and Continue**
5. En **Scopes**: No agregues nada → **Save and Continue**
6. En **Test users**: Agrega tu email → **Save and Continue**
7. **Back to Dashboard**

### 3. Crear OAuth Client ID
1. **Credentials** → **Create Credentials** → **OAuth client ID**
2. **Application type**: Web application
3. **Name**: Alquiler Motos Web
4. **Authorized JavaScript origins**:
   ```
   http://localhost:3000
   https://alquiler-motos.vercel.app
   ```
5. **Authorized redirect URIs**:
   ```
   http://localhost:3000/api/auth/callback/google
   https://alquiler-motos.vercel.app/api/auth/callback/google
   ```
6. **Create**
7. Copia el **Client ID** y **Client Secret**

### 4. Agregar a .env
```env
GOOGLE_CLIENT_ID=tu-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-tu-client-secret
```

---

## 🍎 Apple Sign In

### 1. Apple Developer Account
1. Ve a [developer.apple.com](https://developer.apple.com)
2. Inicia sesión con tu Apple ID
3. **Nota**: Requiere Apple Developer Program ($99/año)

### 2. Crear App ID
1. **Certificates, Identifiers & Profiles** → **Identifiers**
2. Click **+** → Selecciona **App IDs** → **Continue**
3. Selecciona **App** → **Continue**
4. Completa:
   - **Description**: Alquiler Motos
   - **Bundle ID**: `com.alquilermotos.app` (explicit)
5. En **Capabilities**: Marca **Sign in with Apple**
6. **Continue** → **Register**

### 3. Crear Services ID
1. **Identifiers** → **+** → **Services IDs** → **Continue**
2. Completa:
   - **Description**: Alquiler Motos Web
   - **Identifier**: `com.alquilermotos.web`
3. **Continue** → **Register**

### 4. Configurar Services ID
1. Click en el Services ID que creaste
2. Marca **Sign in with Apple**
3. Click **Configure** junto a Sign in with Apple
4. **Primary App ID**: Selecciona el App ID que creaste
5. **Web Domain**: `alquiler-motos.vercel.app` (sin https://)
6. **Return URLs**: 
   ```
   https://alquiler-motos.vercel.app/api/auth/callback/apple
   http://localhost:3000/api/auth/callback/apple
   ```
7. **Next** → **Done** → **Continue** → **Save**

### 5. Crear Key
1. **Keys** → **+**
2. **Key Name**: Alquiler Motos Key
3. Marca **Sign in with Apple** → **Configure**
4. **Primary App ID**: Selecciona tu App ID
5. **Save** → **Continue** → **Register**
6. **Download** el archivo `.p8` (⚠️ solo puedes descargarlo una vez)
7. Copia el **Key ID** (10 caracteres)

### 6. Obtener Team ID
1. Ve a tu perfil (arriba derecha)
2. Copia el **Team ID** (10 caracteres)

### 7. Agregar a .env
```env
APPLE_CLIENT_ID=com.alquilermotos.web
APPLE_CLIENT_SECRET=tu-private-key-p8-content
APPLE_TEAM_ID=ABC1234567
APPLE_KEY_ID=XYZ9876543
```

**Nota**: Para `APPLE_CLIENT_SECRET`, necesitas generar un JWT usando la private key. NextAuth lo puede hacer automáticamente si usas este formato:

```env
APPLE_CLIENT_ID=com.alquilermotos.web
APPLE_TEAM_ID=ABC1234567
APPLE_KEY_ID=XYZ9876543
APPLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQg...
-----END PRIVATE KEY-----"
```

---

## 🔷 Facebook Login

### 1. Meta for Developers
1. Ve a [developers.facebook.com](https://developers.facebook.com)
2. Inicia sesión con tu cuenta de Facebook
3. **My Apps** → **Create App**

### 2. Crear App
1. **Use case**: Other → **Next**
2. **App type**: Consumer → **Next**
3. Completa:
   - **App name**: Alquiler Motos
   - **App contact email**: Tu email
4. **Create app**

### 3. Agregar Facebook Login
1. En el Dashboard → **Add Product**
2. Busca **Facebook Login** → **Set Up**
3. Selecciona **Web**
4. **Site URL**: `https://alquiler-motos.vercel.app`
5. **Save** → **Continue**

### 4. Configurar OAuth Redirect URIs
1. Menú lateral → **Facebook Login** → **Settings**
2. **Valid OAuth Redirect URIs**:
   ```
   http://localhost:3000/api/auth/callback/facebook
   https://alquiler-motos.vercel.app/api/auth/callback/facebook
   ```
3. **Save Changes**

### 5. Obtener Credenciales
1. **Settings** → **Basic**
2. Copia:
   - **App ID**
   - **App Secret** (click "Show")

### 6. Configurar App Domain
1. En **Settings** → **Basic**
2. **App Domains**: `alquiler-motos.vercel.app`
3. **Privacy Policy URL**: (agrega una URL válida)
4. **Terms of Service URL**: (agrega una URL válida)
5. **Save Changes**

### 7. Modo Live
1. En la parte superior, cambia de **Development** a **Live**
2. Completa la información requerida
3. **Switch Mode**

### 8. Agregar a .env
```env
FACEBOOK_CLIENT_ID=tu-app-id
FACEBOOK_CLIENT_SECRET=tu-app-secret
```

---

## 📝 .env Completo

```env
# Database
DATABASE_URL=postgresql://...

# NextAuth
NEXTAUTH_SECRET=tu-secret-aleatorio-seguro
NEXTAUTH_URL=http://localhost:3000
# NEXTAUTH_URL=https://alquiler-motos.vercel.app # Para producción

# Google OAuth
GOOGLE_CLIENT_ID=tu-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-tu-client-secret

# Apple Sign In
APPLE_CLIENT_ID=com.alquilermotos.web
APPLE_TEAM_ID=ABC1234567
APPLE_KEY_ID=XYZ9876543
APPLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQg...
-----END PRIVATE KEY-----"

# Facebook Login
FACEBOOK_CLIENT_ID=tu-app-id
FACEBOOK_CLIENT_SECRET=tu-app-secret

# Retool
RETOOL_API_KEY=tu-api-key-generada

# Verifik (opcional)
VERIFIK_ENABLED=false
VERIFIK_API_KEY=
VERIFIK_SECRET=
```

---

## 🧪 Probar Localmente

1. Agrega las credenciales a `.env.local`
2. Reinicia el servidor:
   ```bash
   npm run dev
   ```
3. Ve a `http://localhost:3000/login`
4. Prueba cada proveedor de OAuth

---

## 🚀 Deploy a Producción

1. En Vercel → **Settings** → **Environment Variables**
2. Agrega todas las variables del `.env`
3. Cambia `NEXTAUTH_URL` a tu dominio de producción
4. Redeploy:
   ```bash
   vercel --prod
   ```

---

## 🔍 Debugging

Si un provider no funciona:

1. **Google**: Verifica que las redirect URIs coincidan exactamente
2. **Apple**: Asegúrate de que la private key esté correctamente formateada
3. **Facebook**: Verifica que el App esté en modo Live
4. **NextAuth**: Revisa los logs en la consola del navegador

### Logs de NextAuth
En desarrollo, NextAuth muestra logs detallados en la consola.

### Test de Callback URLs
Copia y pega esto en tu navegador para verificar:
```
http://localhost:3000/api/auth/signin
```

Deberías ver los botones de Google, Apple y Facebook si todo está configurado.

---

## ⚠️ Notas Importantes

1. **Apple requiere HTTPS en producción** - Localhost funciona sin HTTPS
2. **Facebook requiere URLs de política** - Crea páginas básicas de privacy/terms
3. **Google modo Testing** - Limitado a usuarios de prueba hasta que verifiques la app
4. **Guarda los secrets de forma segura** - Nunca los subas a Git
5. **Usa .env.local para desarrollo** - Git ignora este archivo por defecto
