# 🚀 Guía de Despliegue en Render

Esta guía te ayudará a desplegar tu landing page Net And Soft Solutions en Render.

## 📋 Pre-requisitos

1. Cuenta en [Render.com](https://render.com) (gratuita)
2. Repositorio Git (GitHub, GitLab o Bitbucket)
3. Proyecto listo para desplegar

## 🔧 Configuración del Proyecto

El proyecto ya está configurado con:
- ✅ Script `start` en package.json
- ✅ Archivo `render.yaml` con configuración automática
- ✅ Node.js 18+ compatible

## 📦 Paso 1: Preparar el Repositorio

### Inicializar Git (si no lo has hecho)

```bash
cd net-and-soft-solutions
git init
git add .
git commit -m "Initial commit - Net And Soft Solutions"
```

### Subir a GitHub

```bash
# Crear repositorio en GitHub primero, luego:
git remote add origin https://github.com/tu-usuario/net-and-soft-solutions.git
git branch -M main
git push -u origin main
```

## 🌐 Paso 2: Desplegar en Render

### Opción A: Usando render.yaml (Recomendado)

1. **Ir a Render Dashboard**
   - Ve a [dashboard.render.com](https://dashboard.render.com)
   - Click en "New +" → "Blueprint"

2. **Conectar Repositorio**
   - Selecciona tu repositorio de GitHub
   - Render detectará automáticamente el `render.yaml`
   - Click en "Apply"

3. **Esperar el Despliegue**
   - Render instalará dependencias
   - Compilará el proyecto
   - Iniciará el servidor
   - Te dará una URL: `https://net-and-soft-solutions.onrender.com`

### Opción B: Configuración Manual

1. **Crear Web Service**
   - Click en "New +" → "Web Service"
   - Conecta tu repositorio

2. **Configurar el Servicio**
   ```
   Name: net-and-soft-solutions
   Environment: Node
   Build Command: npm install && npm run build
   Start Command: npm run start
   ```

3. **Variables de Entorno** (Opcional)
   ```
   NODE_VERSION=18.17.0
   NODE_ENV=production
   ```

4. **Plan**
   - Selecciona "Free" para empezar
   - Click en "Create Web Service"

## ⚙️ Configuración Avanzada

### Variables de Entorno

Si necesitas agregar variables de entorno:

1. Ve a tu servicio en Render
2. Click en "Environment"
3. Agrega las variables necesarias:
   ```
   NUXT_PUBLIC_SITE_URL=https://tu-dominio.com
   NUXT_PUBLIC_WHATSAPP_NUMBER=584144785215
   NUXT_PUBLIC_CONTACT_PHONE=+58 414-478-5215
   NUXT_PUBLIC_CONTACT_EMAIL=info@netandsoft.com.ve
   ```

### Dominio Personalizado

1. Ve a "Settings" en tu servicio
2. Scroll hasta "Custom Domain"
3. Click en "Add Custom Domain"
4. Ingresa tu dominio: `netandsoft.com.ve`
5. Configura los DNS según las instrucciones:
   ```
   Type: CNAME
   Name: www
   Value: net-and-soft-solutions.onrender.com
   ```

### SSL/HTTPS

- Render proporciona SSL automático y gratuito
- Se activa automáticamente al agregar un dominio personalizado
- No requiere configuración adicional

## 🔄 Actualizaciones Automáticas

Render desplegará automáticamente cuando hagas push a tu rama principal:

```bash
# Hacer cambios en el código
git add .
git commit -m "Actualizar contenido"
git push origin main

# Render detectará el cambio y desplegará automáticamente
```

## 📊 Monitoreo

### Ver Logs

1. Ve a tu servicio en Render
2. Click en "Logs"
3. Verás los logs en tiempo real

### Métricas

1. Click en "Metrics"
2. Verás:
   - CPU usage
   - Memory usage
   - Request count
   - Response times

## 🐛 Solución de Problemas

### Error: "Build failed"

```bash
# Verificar que el build funciona localmente
npm install
npm run build

# Si funciona localmente, revisar logs en Render
```

### Error: "Application failed to start"

1. Verificar que el script `start` existe en package.json
2. Verificar que `.output/server/index.mjs` se generó en el build
3. Revisar logs para más detalles

### Error: "Module not found"

```bash
# Asegurarse de que todas las dependencias están en package.json
npm install --save [paquete-faltante]
git add package.json package-lock.json
git commit -m "Add missing dependency"
git push
```

### Sitio muy lento

1. Considera actualizar al plan Starter ($7/mes)
2. El plan gratuito tiene limitaciones de recursos
3. Optimiza imágenes y assets

## 💰 Planes de Render

### Free Plan
- ✅ Perfecto para desarrollo y pruebas
- ✅ SSL automático
- ✅ Despliegues ilimitados
- ⚠️ Se duerme después de 15 min de inactividad
- ⚠️ 750 horas/mes

### Starter Plan ($7/mes)
- ✅ Siempre activo
- ✅ Mejor rendimiento
- ✅ Sin límite de horas
- ✅ Ideal para producción

## 🔒 Seguridad

### Headers de Seguridad

Render configura automáticamente:
- HTTPS forzado
- HSTS headers
- Protección DDoS básica

### Backups

- Render mantiene backups automáticos
- Puedes hacer rollback a versiones anteriores
- Ve a "Deploys" → Selecciona versión → "Redeploy"

## ✅ Checklist Post-Despliegue

- [ ] Sitio accesible en la URL de Render
- [ ] HTTPS funcionando
- [ ] Todos los enlaces funcionan
- [ ] WhatsApp integrado correctamente
- [ ] Formulario de contacto funcional
- [ ] Responsive en móvil
- [ ] Dominio personalizado configurado (opcional)
- [ ] Google Search Console configurado
- [ ] Analytics configurado (opcional)

## 📞 Soporte

### Render Support
- Documentación: [render.com/docs](https://render.com/docs)
- Community: [community.render.com](https://community.render.com)
- Status: [status.render.com](https://status.render.com)

### Proyecto
- Email: info@netandsoft.com.ve
- WhatsApp: +58 424-123-4567

## 🎉 ¡Listo!

Tu landing page está ahora desplegada en Render. Comparte tu URL:
- URL de Render: `https://net-and-soft-solutions.onrender.com`
- Dominio personalizado: `https://netandsoft.com.ve` (cuando lo configures)

---

**Nota:** El primer despliegue puede tomar 5-10 minutos. Los siguientes serán más rápidos.