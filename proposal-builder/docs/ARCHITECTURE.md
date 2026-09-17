# Documentación de Arquitectura de Software

**Net & Soft Proposal Builder** es un sistema full-stack moderno construido siguiendo los patrones de **Clean Architecture** y desarrollo seguro por diseño.

---

## 1. Visión General de Capas

```
+-------------------------------------------------------------------+
|                         Capa de Presentación                      |
|  - Next.js 15 App Router (React 19, Server & Client Components)    |
|  - Tailwind CSS + Bespoke Net & Soft Design System                |
|  - Lucide Icons + Responsive Split-View Engine                    |
+-------------------------------------------------------------------+
                                  |
                                  v
+-------------------------------------------------------------------+
|                     Capa de Seguridad y Middleware                 |
|  - RBAC (ADMIN, SALES, VIEWER) en Route Handlers                  |
|  - Argon2id Password Hashing + Lockout tras 5 intentos fallidos   |
|  - Honeypot Real Indetectable (company_website)                    |
|  - Tokens Firmados HMAC-SHA256 con Speed Check (>= 3s)            |
|  - Rate Limiter Sliding Window (Memoria / Redis)                  |
|  - Headers HTTP (CSP, HSTS, X-Frame-Options, nosniff)            |
+-------------------------------------------------------------------+
                                  |
                                  v
+-------------------------------------------------------------------+
|                        Capa de Servicios                           |
|  - AuthService: Sesiones HttpOnly, rotación y bloqueo             |
|  - ClientService: CRM, deduplicación de RIF/Email, archivo lógico  |
|  - ProposalService: Ciclo de vida, autoguardado, versiones JSON   |
|  - PricingService: Fórmulas directas ($6/h, horas de alerta)      |
|  - ToolService: Catálogo base y herramientas personalizadas       |
|  - ExportService: HTML autónomo single-file y JSON versionado     |
|  - GHLService: Webhooks seguros con Idempotencia y HMAC           |
|  - AuditService: Bitácora inmutable de eventos y auditoría        |
+-------------------------------------------------------------------+
                                  |
                                  v
+-------------------------------------------------------------------+
|                     Capa de Datos e Infraestructura               |
|  - Prisma ORM (17 Modelos Normalizados con UUIDs y Claves)        |
|  - PostgreSQL 16 (Almacenamiento relacional persistente)          |
|  - Redis 7 (Caché y límites distribuidos)                         |
|  - Nginx Reverse Proxy (SSL, compresión Gzip, HTTP/2)             |
+-------------------------------------------------------------------+
```

---

## 2. Inmutabilidad de Versiones Comerciales

A diferencia de los CRMs convencionales que sobrescriben propuestas, este sistema implementa **inmutabilidad estricta**:
- Mientras está en borrador (`DRAFT`), el vendedor puede modificar precios, herramientas y horas con autoguardado en tiempo real.
- Al hacer clic en **Publicar**, el sistema toma una instantánea completa en formato JSON y la almacena en el modelo `ProposalVersion`.
- La URL pública `/p/[slug]` lee prioritariamente esta instantánea congelada.
- Si el vendedor necesita hacer modificaciones a una propuesta ya publicada, el sistema genera automáticamente la versión siguiente (`v2`, `v3`) conservando el historial intacto y registrando quién realizó la publicación en la bitácora de auditoría.

---

## 3. Modelo de Protección Anti-Bot

El formulario público de aceptación implementa tres barreras complementarias:

1. **Honeypot Indetectable**:
   - Elemento en el HTML nativo: `<div class="form-trap" aria-hidden="true"><input id="company_website" name="company_website" type="text" tabindex="-1" autocomplete="off" /></div>`
   - Oculto mediante CSS absoluto fuera de la pantalla.
   - Si contiene cualquier valor, el backend descarta la petición simulando éxito (`HTTP 200`), no guarda ningún registro en base de datos, no contacta a GoHighLevel y registra un evento `blocked_spam_submission`.
2. **Token Criptográfico HMAC-SHA256**:
   - Emitido por el servidor al cargar la propuesta con timestamp y nonce único.
   - El backend comprueba que la firma sea legítima y que el tiempo transcurrido sea al menos de 3 segundos (`FORM_MIN_SUBMIT_SECONDS`), deteniendo a cualquier bot automatizado.
3. **Rate Limiting Multidimensional**:
   - Ventana deslizante que evalúa la IP anonimizada, la propuesta y el correo electrónico, respondiendo con `HTTP 429 Too Many Requests` y cabecera `Retry-After`.

---

## 4. Cero Secretos en el Frontend

- Ninguna clave API de GoHighLevel, Turnstile secret, credencial SMTP o secreto de token se envía al navegador del cliente.
- Todas las variables sensibles residen exclusivamente en el entorno del backend en Node.js.
