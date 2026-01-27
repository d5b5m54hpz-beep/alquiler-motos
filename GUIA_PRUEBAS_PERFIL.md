# 🧪 GUÍA DE PRUEBAS - SISTEMA DE PERFIL DE USUARIO

## Requisitos Previos
- ✅ Servidor dev corriendo en `http://localhost:3000`
- ✅ Base de datos sincronizada
- ✅ Usuario autenticado

---

## 📋 PRUEBA 1: ACCEDER AL PERFIL

### Pasos:
1. **Ir a la página de login** → `http://localhost:3000/login`
2. **Hacer login con Google OAuth** o **credenciales** (si existe usuario test)
   - Email: (tu usuario de prueba)
   - Contraseña: (tu contraseña de prueba)
3. **Verificar redirección** → Debe ir a dashboard o página principal
4. **Localizar el botón de perfil** → En la esquina superior derecha del header
   - Avatar circular con inicial del usuario
   - Debe mostrar el nombre del usuario

### Resultado Esperado:
✅ El botón de perfil es visible en el header con avatar y nombre

---

## 📋 PRUEBA 2: DROPDOWN DE PERFIL

### Pasos:
1. **Hacer clic en el botón de perfil** en el header
2. **Verificar que aparezca el dropdown menu** con:
   - Nombre completo del usuario
   - Email del usuario
   - Opción "👤 Mi Cuenta" (link)
   - Opción "🚪 Salir" (botón rojo)

### Resultado Esperado:
✅ Dropdown aparece con todas las opciones
✅ Estilos correctos (colores, hover effects)
✅ El dropdown desaparece al hacer clic fuera

---

## 📋 PRUEBA 3: NAVEGACIÓN A PÁGINA DE PERFIL

### Pasos:
1. **Con el dropdown abierto**, hacer clic en "👤 Mi Cuenta"
2. **Verificar redirección** a `http://localhost:3000/perfil`
3. **Esperar que cargue la página** (loader "Cargando perfil...")

### Resultado Esperado:
✅ Se redirige a `/perfil`
✅ La página carga correctamente
✅ Se muestra "Mi Cuenta" como título principal

---

## 📋 PRUEBA 4: SECCIÓN DE INFORMACIÓN PERSONAL

### Pasos:
1. **En la página `/perfil`, ubicar la sección "Información Personal"**
2. **Verificar que se muestren los siguientes campos:**
   - ✏️ Nombre Completo (editable)
   - 📧 Email (deshabilitado, solo lectura)
   - 📱 Número de Teléfono (editable)

### Verificar Badges de Verificación:
3. **Email:**
   - Si `emailVerifiedAt` tiene valor → Badge "✓ Verificado" en verde
   - Si es null → Sin badge
4. **Teléfono:**
   - Si `phoneVerifiedAt` tiene valor → Badge "✓ Verificado" en verde
   - Si es null → Sin badge

### Prueba de Actualización:
5. **Cambiar el nombre** en el campo de Nombre Completo
6. **Cambiar el número de teléfono** (ej: +54 9 11 23456789)
7. **Hacer clic en "Guardar Cambios"**
8. **Verificar mensaje de éxito** (fondo verde): "Perfil actualizado exitosamente"

### Resultado Esperado:
✅ Los campos carguen con los datos correctos
✅ El botón "Guardar Cambios" se deshabilita mientras guarda
✅ Aparece mensaje de éxito después de guardar
✅ Los datos se reflejan en tiempo real

---

## 📋 PRUEBA 5: SECCIÓN DE SEGURIDAD (CAMBIAR CONTRASEÑA)

⚠️ **NOTA:** Esta sección solo aparece si el usuario fue creado con provider="credentials"

### Pasos:
1. **Ubicar la sección "Seguridad"** (debajo de Información Personal)
2. **Hacer clic en el botón "🔐 Cambiar Contraseña"**
3. **Verificar que aparezcan 3 campos:**
   - Contraseña Actual (required)
   - Nueva Contraseña (required)
   - Confirmar Nueva Contraseña (required)

### Prueba de Validación:
4. **Probar ingresar contraseña incorrecta:**
   - Ingresar contraseña actual equivocada
   - Completar nuevas contraseñas
   - Hacer clic en "Actualizar Contraseña"
   - ❌ Debe mostrar error: "Contraseña actual incorrecta"

5. **Probar contraseñas no coincidentes:**
   - Ingresar contraseña actual correcta
   - Nueva Contraseña: "nuevapass123"
   - Confirmar: "otrapass456"
   - ❌ Debe mostrar error: "Las contraseñas no coinciden"

6. **Probar contraseña muy corta:**
   - Ingresar contrasena actual correcta
   - Nueva Contraseña: "12345" (menos de 6 caracteres)
   - ❌ Debe mostrar error: "La contraseña debe tener al menos 6 caracteres"

7. **Prueba exitosa:**
   - Ingresar contraseña actual correcta
   - Nueva Contraseña: "NuevaContraseña123!"
   - Confirmar Nueva Contraseña: "NuevaContraseña123!"
   - Hacer clic en "Actualizar Contraseña"
   - ✅ Debe mostrar mensaje de éxito: "Contraseña actualizada exitosamente"
   - ✅ El formulario se cierra automáticamente
   - ✅ Botón vuelve a mostrar "🔐 Cambiar Contraseña"

### Resultado Esperado:
✅ Todas las validaciones funcionan correctamente
✅ La contraseña se actualiza en la base de datos
✅ Los mensajes de error son claros y útiles

---

## 📋 PRUEBA 6: SECCIÓN DE VERIFICACIÓN DE DOS PASOS (2FA) - ACTIVAR

### Pasos Iniciales:
1. **Ubicar la sección "Verificación de Dos Pasos"**
2. **Verificar estado inicial:**
   - Si `twoFactorEnabled = false` → Debe mostrar botón "🔐 Activar Verificación de Dos Pasos"
   - Si `twoFactorEnabled = true` → Debe mostrar badge verde "✓ Verificación de dos pasos está activada"

### Prueba de Activación (si no está activado):
3. **Hacer clic en "🔐 Activar Verificación de Dos Pasos"**
4. **Esperar que cargue** y verifique que aparezca:
   - Código QR en la pantalla
   - Instrucción: "Escanea este código QR con tu aplicación autenticadora"
   - Campo de código secreto manual: "JBSWY3DPEBLW64TMMQ======" (ejemplo)
   - Campo de entrada: "Ingresa el código de 6 dígitos"

### Verificación del QR:
5. **Escanear el código QR con una app autenticadora:**
   - Google Authenticator
   - Microsoft Authenticator
   - Authy
   - O cualquier app TOTP compatible
6. **Verificar que la app muestre un código de 6 dígitos** que cambia cada 30 segundos

### Verificación Manual:
7. **Alternativa: Copiar el código secreto manualmente**
   - Copiar el string "JBSWY3DPEBLW64TMMQ======"
   - Pegar en la app autenticadora
   - Seleccionar "Tiempo" como tipo
   - Debe generar un código de 6 dígitos

### Confirmación de Código:
8. **Ingresar el código de 6 dígitos** que genera el autenticador en el campo
9. **Hacer clic en "Verificar y Activar"**
10. **Esperar validación** (máximo 60 segundos, el código cambia cada 30 segundos)

### Resultado Esperado:
✅ Aparece mensaje de éxito: "Verificación de dos pasos activada exitosamente"
✅ Se muestran 10 códigos de respaldo (números aleatorios para emergencia)
✅ La sección cambia a mostrar badge "✓ Verificación de dos pasos está activada"
✅ Si el código es inválido → Error: "Código inválido o expirado"

---

## 📋 PRUEBA 7: VERIFICACIÓN DE DOS PASOS - ESTADO ACTIVADO

### Pasos:
1. **Recargar la página** `/perfil`
2. **Ubicar la sección "Verificación de Dos Pasos"**
3. **Verificar que muestre:**
   - Badge verde: "✓ Verificación de dos pasos está activada"
   - Mensaje: "Tu cuenta está protegida con autenticación de dos factores"
   - Sin opción para cambiar (por ahora)

### Resultado Esperado:
✅ El estado de 2FA persiste en la base de datos
✅ En próximos logins, se solicitará código 2FA
✅ Los códigos de respaldo deben guardarse en lugar seguro

---

## 📋 PRUEBA 8: MENSAJES DE ERROR Y VALIDACIÓN

### Pruebas de Error:
1. **Nombre vacío:**
   - Limpiar el campo de nombre
   - Hacer clic en "Guardar Cambios"
   - ❌ Debe mostrar error: "El nombre es requerido"

2. **Sin sesión (cerrar sesión y acceder a /perfil):**
   - Hacer clic en "Salir" en el dropdown
   - Intentar acceder a `http://localhost:3000/perfil`
   - ❌ Debe redirigir a `/login`

3. **Usuario OAuth intentando cambiar contraseña:**
   - Si el usuario fue creado con Google OAuth
   - La sección "Seguridad" NO debe aparecer
   - ✅ Solo usuarios "credentials" pueden cambiar contraseña

### Resultado Esperado:
✅ Todas las validaciones funcionan correctamente
✅ Los mensajes de error son claros
✅ La seguridad se mantiene intacta

---

## 📋 PRUEBA 9: RESPONSIVIDAD Y UX

### Pruebas:
1. **Cambiar tamaño de pantalla:**
   - Desktop (1920px)
   - Tablet (768px)
   - Mobile (375px)

2. **Verificar que:**
   - ✅ Los formularios se adapten correctamente
   - ✅ El botón de perfil siga visible
   - ✅ El dropdown no se corte
   - ✅ Los inputs sean accesibles en mobile

3. **Hover y Focus States:**
   - Pasar mouse sobre botones → deben cambiar color
   - Tab en inputs → deben mostrar focus
   - Los mensajes de éxito/error sean legibles

### Resultado Esperado:
✅ Interfaz responsive y accesible
✅ UX consistente en todos los tamaños

---

## 📋 PRUEBA 10: PERFORMANCE

### Pasos:
1. **Abrir DevTools (F12)**
2. **Ir a Network**
3. **Recargar `/perfil`**
4. **Verificar:**
   - ✅ El JSON de perfil carga rápido (<200ms)
   - ✅ No hay requests duplicados
   - ✅ Las imágenes (QR) cargan correctamente

5. **Ir a Performance**
6. **Grabar un registro mientras:**
   - Cambias el nombre y guardas
   - Aceptas cambios

### Resultado Esperado:
✅ Buena performance
✅ No hay memory leaks visibles
✅ Las animaciones son suaves

---

## ✅ CHECKLIST FINAL

```
[ ] Botón de perfil visible en header
[ ] Dropdown de perfil funciona correctamente
[ ] Página /perfil carga correctamente
[ ] Formulario de información personal funciona
[ ] Badges de verificación se muestran correctamente
[ ] Cambio de nombre y teléfono se guardan
[ ] Sección de seguridad (solo credentials)
[ ] Cambio de contraseña funciona con validación
[ ] Sección de 2FA se muestra correctamente
[ ] QR code se genera correctamente
[ ] Código secreto manual es copiable
[ ] Verificación de 6 dígitos funciona
[ ] Códigos de respaldo se generan
[ ] Estado de 2FA persiste
[ ] Validaciones y mensajes de error funcionan
[ ] Redirección a /login si no está autenticado
[ ] Responsividad en mobile/tablet
[ ] Performance es aceptable
[ ] No hay errores en la consola
[ ] No hay warnings de React
```

---

## 🐛 REPORTAR PROBLEMAS

Si encuentras algo que no funciona, por favor reporta:
1. **Pantalla donde ocurre el problema**
2. **Pasos exactos para reproducir**
3. **Error esperado vs error real**
4. **Screenshot o video si es posible**
5. **Información del navegador y SO**

---

## 📝 NOTAS IMPORTANTES

- Los cambios se guardan en PostgreSQL (Neon)
- 2FA utiliza estándar TOTP (RFC 6238)
- Los códigos de respaldo NO se pueden regenerar automáticamente
- Si pierdes los códigos de respaldo, necesitarás desactivar 2FA y reactivar
- Las sesiones actuales NO se cierran si cambias contraseña (NextAuth las mantiene)
