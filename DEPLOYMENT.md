# 🚀 Guía de Despliegue - Net And Soft Solutions

Esta guía te ayudará a desplegar tu landing page en diferentes plataformas.

## 📋 Pre-requisitos

Antes de desplegar, asegúrate de:

1. ✅ Actualizar el número de WhatsApp en todos los componentes
2. ✅ Configurar la información de contacto correcta
3. ✅ Personalizar el contenido según tus necesidades
4. ✅ Probar localmente con `npm run dev`
5. ✅ Verificar que no hay errores de compilación con `npm run build`

## 🌐 Opciones de Despliegue

### Opción 1: Vercel (Recomendado) ⭐

Vercel es la plataforma oficial de Nuxt.js y ofrece despliegue gratuito con excelente rendimiento.

#### Pasos:

1. **Crear cuenta en Vercel**
   - Ve a [vercel.com](https://vercel.com)
   - Regístrate con GitHub, GitLab o Bitbucket

2. **Conectar repositorio**
   ```bash
   # Inicializar Git (si no lo has hecho)
   git init
   git add .
   git commit -m "Initial commit"
   
   # Crear repositorio en GitHub y conectar
   git remote add origin https://github.com/tu-usuario/net-and-soft-solutions.git
   git push -u origin main
   ```

3. **Importar proyecto en Vercel**
   - Click en "New Project"
   - Selecciona tu repositorio
   - Vercel detectará automáticamente Nuxt.js
   - Click en "Deploy"

4. **Configurar dominio personalizado** (Opcional)
   - Ve a Settings > Domains
   - Agrega tu dominio personalizado
   - Configura los DNS según las instrucciones

#### Variables de Entorno (si las necesitas):
```env
NUXT_PUBLIC_SITE_URL=https://tu-dominio.com
```

---

### Opción 2: Netlify

Netlify es otra excelente opción con plan gratuito generoso.

#### Pasos:

1. **Crear cuenta en Netlify**
   - Ve a [netlify.com](https://netlify.com)
   - Regístrate con GitHub, GitLab o Bitbucket

2. **Configurar build settings**
   - Build command: `npm run generate`
   - Publish directory: `.output/public`

3. **Desplegar**
   ```bash
   # Opción A: Desde la interfaz web
   # - Arrastra la carpeta .output/public después de ejecutar npm run generate
   
   # Opción B: Con Netlify CLI
   npm install -g netlify-cli
   npm run generate
   netlify deploy --prod
   ```

4. **Configurar dominio personalizado**
   - Ve a Domain settings
   - Agrega tu dominio
   - Configura los DNS

---

### Opción 3: GitHub Pages

Para sitio estático gratuito en GitHub.

#### Pasos:

1. **Generar sitio estático**
   ```bash
   npm run generate
   ```

2. **Configurar GitHub Pages**
   - Crea un repositorio en GitHub
   - Ve a Settings > Pages
   - Selecciona la rama y carpeta

3. **Desplegar con GitHub Actions**
   
   Crea `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to GitHub Pages
   
   on:
     push:
       branches: [ main ]
   
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         
         - name: Setup Node
           uses: actions/setup-node@v3
           with:
             node-version: '18'
             
         - name: Install dependencies
           run: npm ci
           
         - name: Generate static site
           run: npm run generate
           
         - name: Deploy to GitHub Pages
           uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./.output/public
   ```

---

### Opción 4: Servidor VPS (DigitalOcean, AWS, etc.)

Para mayor control y personalización.

#### Requisitos:
- Servidor con Node.js 18+
- Nginx o Apache
- Certificado SSL (Let's Encrypt)

#### Pasos:

1. **Conectar al servidor**
   ```bash
   ssh usuario@tu-servidor.com
   ```

2. **Instalar Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Clonar repositorio**
   ```bash
   git clone https://github.com/tu-usuario/net-and-soft-solutions.git
   cd net-and-soft-solutions
   npm install
   ```

4. **Generar sitio**
   ```bash
   npm run generate
   ```

5. **Configurar Nginx**
   ```nginx
   server {
       listen 80;
       server_name netandsoft.com.ve www.netandsoft.com.ve;
       
       root /var/www/net-and-soft-solutions/.output/public;
       index index.html;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
       
       # Gzip compression
       gzip on;
       gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
   }
   ```

6. **Instalar SSL con Let's Encrypt**
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot --nginx -d netandsoft.com.ve -d www.netandsoft.com.ve
   ```

---

## 🔧 Configuración Post-Despliegue

### 1. Verificar SEO
- [ ] Google Search Console configurado
- [ ] Sitemap enviado
- [ ] Robots.txt accesible
- [ ] Meta tags correctos

### 2. Configurar Analytics (Opcional)
```bash
npm install @nuxtjs/google-analytics
```

En `nuxt.config.ts`:
```typescript
modules: [
  ['@nuxtjs/google-analytics', {
    id: 'UA-XXX-XXX'
  }]
]
```

### 3. Optimizar Rendimiento
- [ ] Habilitar compresión Gzip/Brotli
- [ ] Configurar caché de navegador
- [ ] Usar CDN para assets estáticos
- [ ] Optimizar imágenes

### 4. Seguridad
- [ ] HTTPS habilitado
- [ ] Headers de seguridad configurados
- [ ] Firewall configurado (si aplica)

---

## 📊 Monitoreo

### Google Search Console
1. Ve a [search.google.com/search-console](https://search.google.com/search-console)
2. Agrega tu propiedad
3. Verifica la propiedad
4. Envía el sitemap: `https://tu-dominio.com/sitemap.xml`

### Google Analytics
1. Crea una cuenta en [analytics.google.com](https://analytics.google.com)
2. Obtén tu ID de seguimiento
3. Agrégalo a tu configuración de Nuxt

### PageSpeed Insights
- Prueba tu sitio en [pagespeed.web.dev](https://pagespeed.web.dev)
- Objetivo: Score 90+ en móvil y desktop

---

## 🔄 Actualizaciones

### Actualizar contenido:
```bash
# 1. Hacer cambios en el código
# 2. Commit y push
git add .
git commit -m "Actualizar contenido"
git push

# 3. El despliegue será automático en Vercel/Netlify
```

### Actualizar dependencias:
```bash
npm update
npm audit fix
```

---

## 🐛 Solución de Problemas

### Error: "Module not found"
```bash
rm -rf node_modules .nuxt
npm install
npm run dev
```

### Error: "Build failed"
```bash
# Verificar logs
npm run build

# Limpiar caché
rm -rf .nuxt .output
npm run build
```

### Sitio no se actualiza
- Limpiar caché del navegador (Ctrl + Shift + R)
- Verificar que el despliegue se completó
- Revisar logs de la plataforma

---

## 📞 Soporte

Si necesitas ayuda con el despliegue:
- Email: info@netandsoft.com.ve
- WhatsApp: +58 424-123-4567

---

## ✅ Checklist Final

Antes de considerar el despliegue completo:

- [ ] Sitio accesible en producción
- [ ] HTTPS funcionando correctamente
- [ ] Todos los enlaces funcionan
- [ ] WhatsApp integrado correctamente
- [ ] Formulario de contacto funcional
- [ ] Responsive en móvil, tablet y desktop
- [ ] SEO configurado (meta tags, sitemap)
- [ ] Analytics configurado (opcional)
- [ ] Rendimiento optimizado (Lighthouse 90+)
- [ ] Dominio personalizado configurado
- [ ] Certificado SSL válido

---

**¡Felicitaciones! Tu landing page está lista para recibir pacientes. 🎉**