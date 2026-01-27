# Configuración Retool para Alquiler Motos

## Información del Despliegue

**Base URL de Producción:**  
`https://alquiler-motos.vercel.app`

**API Key de Servicio:**  
```
2961354027da23c780e5580ee4eb9ce500e140bdf9157696a6a2684eca412a18
```

## Configurar Recurso REST en Retool

1. **Crear nuevo recurso REST API:**
   - Nombre: `alquiler_api`
   - Base URL: `https://alquiler-motos.vercel.app`

2. **Añadir Header de Autenticación:**
   - Header Name: `x-api-key`
   - Header Value: `2961354027da23c780e5580ee4eb9ce500e140bdf9157696a6a2684eca412a18`
   
   Alternativamente puedes usar:
   - Header Name: `Authorization`
   - Header Value: `Bearer 2961354027da23c780e5580ee4eb9ce500e140bdf9157696a6a2684eca412a18`

3. **Guardar el recurso**

- `GET /api/clientes` - Listar todos los clientes
- `GET /api/clientes/:id` - Obtener un cliente específico


  ## UI de Retool: Verificación de Licencia

  ### Widgets sugeridos
  - FilePicker: `frontImageInput` (requerido)
  - FilePicker: `backImageInput` (opcional)
  - TextInput: `dniExpected`, `fullNameExpected`, `licenseExpected`
  - DateInput: `expiryExpected`
  - Button: `btnValidarLicencia`
  - JSONViewer: `licenciaData`
  - Table: `mismatchesTable`
  - Tag: `estadoTag`

  ### Query REST: `verificarLicencia`
  - Método: `POST`
  - URL: `/api/verificaciones/licencia`
  - Header: `x-api-key: <tu_api_key>`
  - Body (Transformer JS):

  ```javascript
#### Contratos
- `GET /api/contratos` - Listar todos los contratos (incluye cliente y moto)
- `GET /api/contratos/:id` - Obtener un contrato específico

#### Motos
- `GET /api/motos` - Listar todas las motos
- `GET /api/motos/:id` - Obtener una moto específica

### Protegidos (Requieren API Key con rol auditor)

### Protegidos (Requieren API Key con rol auditor)

#### Pagos
- `GET /api/pagos` - Listar todos los pagos con información del contrato

#### Facturas
- `GET /api/facturas` - Listar todas las facturas con datos completos (contrato, cliente, moto, pago)

#### Alertas
- `GET /api/alertas` - Listar todas las alertas del sistema
- `GET /api/alertas/count` - Contar alertas no leídas

#### Dashboard y Reportes
- `GET /api/dashboard` - Estadísticas generales del dashboard

  ### Acción del botón `btnValidarLicencia`

  ```javascript
- `GET /api/dashboard/charts` - Datos para gráficos del dashboard
- `GET /api/charts/ingresos` - Reporte de ingresos por período
- `GET /api/charts/ingresos-mes` - Reporte de ingresos mensuales
- `GET /api/export/pagos` - Exportar datos de pagos

## Endpoints que Requieren Sesión de Usuario (No disponibles con API Key)

Estos endpoints requieren rol `admin` o `operador` y no funcionan con el API key:

- `POST /api/clientes` - Crear cliente
- `POST /api/contratos` - Crear contrato
- `POST /api/motos` - Crear moto
- `POST /api/pagos` - Crear pago
- `POST /api/pagos/marcar-pagado` - Marcar pago como pagado
- `POST /api/usuarios` - Crear usuario
- `PATCH /api/usuarios/:id` - Actualizar usuario
- `DELETE /api/*` - Eliminar recursos

  ### Validaciones UX
  - Deshabilitar botón si `frontImageInput.files.length === 0`
  - Mostrar preview de imágenes usando `frontImageInput.files[0].data`
  - Resaltar inputs esperados si hay `mismatches` (e.g., marcar inválido)

## Ejemplo de Queries en Retool

### Queries Básicas
```javascript
// Listar todos los clientes (público)
return await alquiler_api.get('/api/clientes');

// Listar todos los pagos (requiere API key)
return await alquiler_api.get('/api/pagos');

// Obtener cliente por ID
return await alquiler_api.get('/api/clientes/' + clienteIdSelect.value);
```

### Queries con Filtros
```javascript
// Obtener contratos activos (filtrar en el cliente)
const data = await alquiler_api.get('/api/contratos');
return data.filter(c => c.estado === 'activo');

// Obtener pagos pendientes
const pagos = await alquiler_api.get('/api/pagos');
return pagos.filter(p => p.estado === 'pendiente');

// Buscar cliente por DNI
const clientes = await alquiler_api.get('/api/clientes');
return clientes.find(c => c.dni === dniInput.value);
```

### Queries Combinadas
```javascript
// Obtener contratos de un cliente con detalles
const contratos = await alquiler_api.get('/api/contratos');
const clienteContratos = contratos.filter(c => c.clienteId === clienteId.value);
return clienteContratos;

// Dashboard personalizado
const [clientes, contratos, pagos] = await Promise.all([
  alquiler_api.get('/api/clientes'),
  alquiler_api.get('/api/contratos'),
  alquiler_api.get('/api/pagos')
]);
return { clientes, contratos, pagos };
```

## Verificación

Puedes probar el acceso desde tu terminal:

```bash
# Con x-api-key
curl -H "x-api-key: 2961354027da23c780e5580ee4eb9ce500e140bdf9157696a6a2684eca412a18" \
  https://alquiler-motos.vercel.app/api/clientes

# Con Authorization Bearer
curl -H "Authorization: Bearer 2961354027da23c780e5580ee4eb9ce500e140bdf9157696a6a2684eca412a18" \
  https://alquiler-motos.vercel.app/api/pagos
```

## Seguridad

- El API key está configurado en las variables de entorno de Vercel como `RETOOL_API_KEY`
- El API key otorga permisos de rol `auditor` (solo lectura) cuando los endpoints lo permiten
- Los endpoints de mutación (POST, PATCH, DELETE) permanecen protegidos y requieren autenticación de usuario con rol apropiado
- **No compartas este API key públicamente** - guárdalo de forma segura en Retool como recurso privado
- Los endpoints públicos (clientes, contratos, motos) no requieren API key pero están expuestos para consulta

## Notas Importantes

- **Rate Limiting:** Vercel aplica límites según el plan (Hobby: 100 req/10s por IP)
- **Datos Relacionados:** Los endpoints GET incluyen datos relacionados automáticamente (ej: contratos incluyen cliente y moto)
- **Filtrado:** La API devuelve todos los registros; aplica filtros en Retool según necesites
- **Paginación:** Para grandes volúmenes, considera implementar paginación server-side si es necesario

## Soporte

Si necesitas acceso a endpoints de escritura desde Retool, considera:
1. Implementar un flujo OAuth para autenticación de usuario
2. Crear endpoints específicos de integración con validación adicional
3. Usar webhooks de Retool con validación de firma
