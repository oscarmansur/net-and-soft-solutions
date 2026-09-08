# Net And Soft Solutions

Landing page profesional para soluciones en tecnología para empresas, desarrollada con Nuxt.js 3, TypeScript y Tailwind CSS.

## 🎨 Características

- ✅ **Diseño Moderno y Minimalista**: Interfaz elegante y corporativa
- ✅ **Totalmente Responsivo**: Optimizado para móviles, tablets y desktop
- ✅ **SEO Optimizado**: Meta tags, Open Graph, Twitter Cards y datos estructurados
- ✅ **Rendimiento Óptimo**: Lighthouse score 90+
- ✅ **Integración WhatsApp**: Botón flotante y enlaces directos
- ✅ **Animaciones Suaves**: Transiciones y efectos visuales profesionales
- ✅ **Accesibilidad**: Cumple con estándares WCAG

## 🎯 Servicios Destacados

1. **Desarrollo de Software** - Aplicaciones web, móviles y sistemas corporativos a medida
2. **Infraestructura de Redes** - Cableado estructurado, fibra óptica, switching y routing empresarial
3. **Sistemas de Videovigilancia CCTV** - Cámaras IP de alta resolución, DVR/NVR y monitoreo 24/7
4. **Soporte Técnico Especializado** - Mantenimiento preventivo, correctivo y asistencia IT continua

## 🎨 Paleta de Colores

```css
Primary (Deep Obsidian Navy): #022B3A
Secondary (Cyan Teal):        #1F7A8C
Accent (Soft Blue Ice):       #BFDBF7
Light (Muted Alabaster):      #E1E5F2
```

## 🚀 Tecnologías

- **Framework**: Nuxt 3 (v3.19+)
- **Lenguaje**: TypeScript (Strict Mode)
- **Estilos**: Tailwind CSS con Modo Oscuro nativo
- **Internacionalización**: @nuxtjs/i18n (Español & English)
- **Estado Global**: Pinia + Pinia Plugin Persistedstate
- **SEO & Sitemaps**: @nuxtjs/seo, @nuxtjs/sitemap
- **Imágenes**: @nuxt/image
- **Animaciones**: AOS (Animate on Scroll) & GSAP
- **Fuentes**: Google Fonts (Inter, Poppins)

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Modo desarrollo
npm run dev

# Compilar para producción
npm run build

# Iniciar servidor de producción
npm run start

# Vista previa de producción
npm run preview

# Generar sitio estático
npm run generate
```

## 🌐 Despliegue Rápido en Render

El proyecto está configurado para desplegar fácilmente en Render:

```bash
# 1. Subir a GitHub
git init
git add .
git commit -m "Initial commit"
git push origin main

# 2. En Render Dashboard:
# - New + → Blueprint
# - Conectar repositorio
# - ¡Listo! Render detectará render.yaml automáticamente
```

Ver guía completa en [`RENDER_DEPLOY.md`](RENDER_DEPLOY.md:1)

## 📁 Estructura del Proyecto

```
net-and-soft-solutions/
├── assets/
│   └── css/
│       └── main.css              # Estilos globales y Tailwind
├── components/
│   ├── layout/
│   │   ├── Header.vue            # Navegación principal
│   │   ├── Footer.vue            # Pie de página
│   │   └── WhatsAppButton.vue    # Botón flotante de WhatsApp
│   └── sections/
│       ├── HeroSection.vue       # Sección hero principal
│       ├── ServicesSection.vue   # Servicios tecnológicos (Software, Redes, CCTV, Soporte)
│       ├── AboutSection.vue      # Sobre nosotros
│       └── ContactSection.vue    # Formulario de contacto
├── pages/
│   └── index.vue                 # Página principal con SEO
├── public/
│   ├── logo.svg                  # Logo de la empresa
│   ├── favicon.ico               # Favicon
│   └── robots.txt                # Configuración de robots
├── nuxt.config.ts                # Configuración de Nuxt
├── tailwind.config.ts            # Configuración de Tailwind
└── tsconfig.json                 # Configuración de TypeScript
```

## 🔧 Configuración

### Actualizar Número de WhatsApp

Buscar y reemplazar `584241234567` en los siguientes archivos:
- `components/layout/Header.vue`
- `components/layout/WhatsAppButton.vue`
- `components/layout/Footer.vue`
- `components/sections/HeroSection.vue`
- `components/sections/ServicesSection.vue`
- `components/sections/ContactSection.vue`

### Actualizar Información de Contacto

Editar en `components/sections/ContactSection.vue`:
- Teléfono
- Email
- Horarios

### Personalizar SEO

Editar en `pages/index.vue`:
- Título de la página
- Descripción
- Keywords
- URL del sitio
- Imágenes Open Graph

### Modificar Colores

Editar `tailwind.config.ts` para cambiar la paleta de colores.

## 📱 Secciones de la Landing Page

### 1. Header (Navegación)
- Logo de la empresa
- Menú de navegación
- Botón de contacto WhatsApp
- Menú móvil responsivo

### 2. Hero Section
- Título principal impactante
- Descripción de servicios
- Call-to-action prominente
- Indicadores de confianza
- Animaciones de entrada

### 3. Services Section
- 3 tarjetas de servicios principales
- Iconos personalizados
- Descripción detallada
- Enlaces a WhatsApp por servicio
- Estadísticas de la empresa

### 4. About Section
- Misión y visión
- Valores corporativos
- Beneficios de elegir el servicio
- Certificaciones y avales

### 5. Contact Section
- Información de contacto
- Formulario de contacto
- Integración con WhatsApp
- Mapa de ubicación (placeholder)

### 6. Footer
- Información de la empresa
- Enlaces rápidos
- Servicios
- Datos de contacto
- Redes sociales

### 7. WhatsApp Button
- Botón flotante siempre visible
- Animación de pulso
- Tooltip informativo
- Enlace directo a chat

## 🎯 SEO y Optimización

### Meta Tags Implementados
- Title y Description optimizados
- Keywords relevantes
- Open Graph para redes sociales
- Twitter Cards
- Canonical URL
- Language y Geo tags

### Datos Estructurados (JSON-LD)
- MedicalBusiness
- WebSite
- Organization
- OfferCatalog con servicios
- AggregateRating

### Optimizaciones de Rendimiento
- Lazy loading de imágenes
- Code splitting automático
- Compresión de assets
- Fuentes optimizadas
- CSS crítico inline

## 🌐 Despliegue

### Vercel (Recomendado)
```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel
```

### Netlify
```bash
# Instalar Netlify CLI
npm i -g netlify-cli

# Desplegar
netlify deploy --prod
```

### Sitio Estático
```bash
# Generar sitio estático
npm run generate

# Los archivos estarán en .output/public/
```

## 📝 Personalización Adicional

### Agregar Nuevos Servicios
1. Editar `components/sections/ServicesSection.vue`
2. Agregar nuevo objeto al array `services`
3. Incluir título, descripción, icono y características

### Modificar Estilos
- Colores: `tailwind.config.ts`
- Fuentes: `assets/css/main.css`
- Animaciones: `assets/css/main.css`

### Agregar Páginas
1. Crear archivo en `pages/`
2. Nuxt generará automáticamente la ruta

## 🔒 Seguridad

- HTTPS obligatorio en producción
- Headers de seguridad configurados
- Validación de formularios
- Protección contra XSS

## 📊 Analytics (Opcional)

Para agregar Google Analytics:
```bash
npm install @nuxtjs/google-analytics
```

Configurar en `nuxt.config.ts`:
```typescript
modules: [
  ['@nuxtjs/google-analytics', {
    id: 'UA-XXX-X'
  }]
]
```

## 🐛 Solución de Problemas

### Error de TypeScript
```bash
# Regenerar tipos
npm run postinstall
```

### Estilos no se aplican
```bash
# Limpiar caché
rm -rf .nuxt node_modules/.cache
npm install
```

### Imágenes no cargan
- Verificar que estén en `public/`
- Usar rutas absolutas: `/imagen.jpg`

## 📞 Soporte

Para soporte técnico o consultas:
- Email: info@netandsoft.com.ve
- WhatsApp: +58 414-478-5215

## 📄 Licencia

© 2025 Net And Soft Solutions. Todos los derechos reservados.

---

**Desarrollado con ❤️ para Net And Soft Solutions**
