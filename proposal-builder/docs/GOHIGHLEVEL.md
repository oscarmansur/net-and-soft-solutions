# Integración con GoHighLevel (GHL)

Guía para la conexión segura y backend-only entre **Net & Soft Proposal Builder** y el CRM GoHighLevel.

---

## 1. Principio de Seguridad

- **Cero exposición en frontend**: Ninguna API Key, Token o Webhook URL de GoHighLevel se incluye en el código cliente.
- **Filtro Previo Obligatorio**: La llamada hacia GoHighLevel se despacha **ÚNICAMENTE** tras superar todas las capas de seguridad:
  1. Honeypot real (`company_website`) limpio.
  2. Firma criptográfica HMAC del token validada.
  3. Comprobación de tiempo mínimo (&ge; 3 segundos).
  4. Rate limiting no superado.
  5. Validación de esquema Zod correcta.
  6. Aceptación explícita de los términos de la propuesta.
- **Deduplicación por Idempotencia**: Cada envío incluye la cabecera `Idempotency-Key` basada en el código de propuesta, versión, correo y fecha para evitar crear oportunidades o contactos duplicados por reintentos de red.

---

## 2. Variables de Entorno

En su archivo `.env` del servidor:

```env
GHL_ENABLED=true
GHL_WEBHOOK_URL=https://services.leadconnectorhq.com/hooks/CAMBIA_ESTE_WEBHOOK
GHL_API_KEY=tu_api_key_v2_aqui
GHL_LOCATION_ID=tu_location_id_aqui
GHL_WEBHOOK_SECRET=clave_secreta_hmac_opcional
```

---

## 3. Estructura del Payload Enviado

Cuando un cliente solicita la activación de una propuesta, GoHighLevel recibe el siguiente JSON:

```json
{
  "proposalCode": "NS-BIMOTO-2026-001",
  "proposalVersion": 1,
  "clientName": "Bimoto Imperio C.A.",
  "contactName": "Carlos Mendoza",
  "email": "gerencia@bimotoimperio.com",
  "phone": "+58 414 1234567",
  "monthlyPrice": 120,
  "includedHours": 20,
  "pricePerHour": 6,
  "extraHourPrice": 10,
  "selectedTools": [
    "TacticalRMM",
    "Saint",
    "VPN ZetaNet",
    "ContaExperto"
  ],
  "proposalStatus": "ACCEPTED",
  "publicUrl": "https://cotiza.netandsoft.com.ve/p/bimoto-imperio-2026",
  "acceptedAt": "2026-09-15T21:00:00.000Z"
}
```

---

## 4. Cabeceras HTTP de Envío

```http
POST /hooks/... HTTP/1.1
Host: services.leadconnectorhq.com
Content-Type: application/json
Authorization: Bearer tu_api_key_v2_aqui
Idempotency-Key: a1b2c3d4e5f6... (SHA-256 único)
X-GHL-Signature: ... (HMAC-SHA256 del body)
User-Agent: NetAndSoft-ProposalBuilder/1.0
```

---

## 5. Auditoría y Reintentos

Todos los envíos se registran en la tabla `IntegrationDelivery` de PostgreSQL con su estado (`PENDING`, `DELIVERED`, `FAILED`), código de respuesta HTTP y cuerpo de error. En caso de timeout o caída de red, el sistema programa reintentos automáticos con backoff exponencial.
