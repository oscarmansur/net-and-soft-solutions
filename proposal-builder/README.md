# Net & Soft Proposal Builder

Sistema web empresarial desarrollado para **Net & Soft Solutions** (`https://netandsoft.com.ve/`), diseñado para crear, administrar, previsualizar en tiempo real, publicar en subdominio, exportar y controlar propuestas comerciales interactivas.

---

## 🎯 Características Principales

1. **CRM de Clientes**: Registro completo de empresas, contactos, sector, cantidad de usuarios y estaciones de trabajo. Deduplicación inteligente por RIF, correo y teléfono.
2. **Wizard de 12 Pasos**: Flujo guiado con guardado automático reactivo (debounce 1s), validaciones Zod y restauración de borradores.
3. **Vista Previa Dividida (Split-View)**: Previsualización en vivo en la misma pantalla con selectores para Escritorio, Tableta y Móvil.
4. **Calculadora Financiera y de Horas**: Modelo directo sin ambigüedades. Formateo limpio sin ceros decimales innecesarios (ej. `$6` y no `$6.00`).
5. **Catálogo Maestro y Personalizado de Herramientas**: Cobertura preconfigurada para TacticalRMM, Saint, VPN ZetaNet, ContaExperto, Microsoft 365, Respaldos, CCTV, Redes y herramientas a la medida con persistencia en PostgreSQL.
6. **Defensa Anti-Bot Multicapa**:
   - **Honeypot Real**: Campo accesible fuera de pantalla (`company_website`), rechazado silenciosamente en backend sin alertar al bot y logueado como `blocked_spam_submission`.
   - **Token Firmado HMAC y Speed Check**: Validación criptográfica y comprobación de tiempo mínimo (&ge; 3 segundos).
   - **Rate Limiting Granular**: Control por IP y propuesta con cabeceras `Retry-After`.
7. **Inmutabilidad y Versionado**: Cada publicación genera una versión inmutable (`ProposalVersion`) en JSON con historial de cambios.
8. **Exportación Autónoma**: Generación de archivos HTML single-file responsivos, descarga en JSON y preparación para PDF.
9. **Seguridad Robusta**: Hashing de contraseñas con **Argon2id**, bloqueo automático tras 5 intentos fallidos, cookies HttpOnly/Secure/SameSite y RBAC en backend (`ADMIN`, `SALES`, `VIEWER`).
10. **Integración con GoHighLevel**: Despacho seguro por backend con clave de idempotencia (`Idempotency-Key`) y firma HMAC.

---

## 🚀 Inicio Rápido en Desarrollo

### Requisitos
- Node.js 20 o superior
- PostgreSQL 16
- Redis (opcional, fallback automático en memoria)

### 1. Instalación de dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
```bash
cp .env.example .env
```
Edite `.env` con las credenciales de su base de datos local o de desarrollo.

### 3. Generar cliente Prisma y aplicar migraciones
```bash
npx prisma generate
npx prisma migrate deploy
```

### 4. Cargar datos iniciales y propuesta de demostración (Bimoto Imperio)
```bash
npm run prisma:seed
```
Esto inicializa:
- Catálogo de 10 herramientas y 7 actividades de soporte
- Cliente demo: **Bimoto Imperio C.A.**
- Propuesta demo publicada: `NS-BIMOTO-2026-001` disponible en `/p/bimoto-imperio-2026`

Para crear o actualizar el usuario administrador inicial de forma segura:
```bash
npx tsx scripts/create-admin.ts <email> <password> [nombre]
```

### 5. Iniciar servidor de desarrollo
```bash
npm run dev
```
Abra [http://localhost:3000](http://localhost:3000) en su navegador.

### 6. Ejecutar pruebas automatizadas
```bash
npm run test
```

---

## 🐳 Despliegue en Producción con Docker Compose

Para publicar la aplicación en el subdominio `https://cotiza.netandsoft.com.ve` o `https://cotiza.netandsoft.com.ve`:

```bash
docker compose up -d --build
```
Revise la guía completa en [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md).

---

## 📚 Documentación Técnica Adicional

- [Arquitectura de Software](./docs/ARCHITECTURE.md)
- [Guía de Despliegue y Subdominio](./docs/DEPLOYMENT.md)
- [Respaldo y Restauración de Base de Datos](./docs/BACKUP_RESTORE.md)
- [Integración con GoHighLevel](./docs/GOHIGHLEVEL.md)
- [Sustitución de Logotipos e Isotipos Corporativos](./docs/LOGO_REPLACEMENT.md)
- [Especificación OpenAPI](./docs/OPENAPI.yaml)

---

## 🏢 Identidad Corporativa

- **Empresa**: Net & Soft Solutions C.A.
- **Dominio Principal**: [https://netandsoft.com.ve/](https://netandsoft.com.ve/)
- **Subdominio de Aplicación**: `https://cotiza.netandsoft.com.ve`
