# 🎨 Guía de Personalización - Net And Soft Solutions

Esta guía te ayudará a personalizar la landing page según tus necesidades específicas.

## 📱 Configurar Contacto (Teléfono, WhatsApp y Correo)

Toda la información de contacto se administra centralmente a través de **variables de entorno** en tu archivo `.env`. Ya no necesitas modificar manualmente el código fuente.

### Variables en `.env`:
```env
# Correo electrónico de contacto principal
NUXT_PUBLIC_CONTACT_EMAIL=info@netandsoft.com.ve

# Teléfono con formato visible para llamadas
NUXT_PUBLIC_CONTACT_PHONE=+58 414-478-5215

# Número de WhatsApp (código de país + número, solo dígitos sin espacios ni guiones)
NUXT_PUBLIC_WHATSAPP_NUMBER=584144785215

# Dirección física mostrada en el badge sobre el mapa y Schema SEO
NUXT_PUBLIC_LOCATION_ADDRESS=27 C. Muñoz, San Fernando de Apure 7001, Apure.

# Coordenadas y zoom para el mapa interactivo de Google Maps
NUXT_PUBLIC_MAP_LATITUDE=7.8921750877067645
NUXT_PUBLIC_MAP_LONGITUDE=-67.46952135309213
NUXT_PUBLIC_MAP_ZOOM=13
# Opcional: coordenadas combinadas (anula latitud y longitud individuales si está definida)
# NUXT_PUBLIC_MAP_COORDINATES=7.8921750877067645,-67.46952135309213
```

Todos los componentes ([Header](components/layout/Header.vue), [Footer](components/layout/Footer.vue), [WhatsAppButton](components/layout/WhatsAppButton.vue), [ContactSection](components/sections/ContactSection.vue), [HeroSection](components/sections/HeroSection.vue), [ServicesSection](components/sections/ServicesSection.vue), y las páginas [index](pages/index.vue), [sitemap](pages/sitemap.vue) y [privacy](pages/privacy.vue)) leen estos valores dinámicamente mediante el composable `useContact()`.

---

## ⏰ Actualizar Horarios de Atención

Modifica los horarios en:
- [`components/layout/Footer.vue`](components/layout/Footer.vue)
- [`components/sections/ContactSection.vue`](components/sections/ContactSection.vue)
- O en los archivos de traducción [`i18n/locales/es.json`](i18n/locales/es.json) y [`i18n/locales/en.json`](i18n/locales/en.json) bajo `contact.info` y `footer.Schedule`.

---

## 🎨 Cambiar Colores

Edita [`tailwind.config.ts`](tailwind.config.ts:1) para modificar la paleta de colores:

```typescript
colors: {
  primary: {
    DEFAULT: '#TU_COLOR_AQUI',
    // ... más tonos
  },
  secondary: {
    DEFAULT: '#TU_COLOR_AQUI',
    // ... más tonos
  }
}
```

**Herramientas útiles:**
- [Coolors.co](https://coolors.co) - Generador de paletas
- [Color Hunt](https://colorhunt.co) - Paletas prediseñadas
- [Adobe Color](https://color.adobe.com) - Rueda de colores

---

## 🖼️ Cambiar Logo

1. Reemplaza [`public/logo.svg`](public/logo.svg:1) con tu logo
2. Formatos recomendados: SVG (preferido), PNG con fondo transparente
3. Dimensiones recomendadas: 300x100px o similar proporción

Si usas PNG en lugar de SVG:
- Actualiza la referencia en [`components/layout/Header.vue`](components/layout/Header.vue:9)
- Cambia `logo.svg` por `logo.png`

---

## 📝 Modificar Contenido

### Título Principal (Hero)
Edita [`components/sections/HeroSection.vue`](components/sections/HeroSection.vue:21):
```vue
<h1>
  Tu Nuevo Título <span class="text-gradient">Aquí</span>
</h1>
```

### Descripción de Servicios
Modifica [`components/sections/ServicesSection.vue`](components/sections/ServicesSection.vue:107):
```typescript
const services = [
  {
    title: 'Tu Servicio',
    description: 'Tu descripción',
    features: [
      'Característica 1',
      'Característica 2'
    ]
  }
]
```

### Sección "Sobre Nosotros"
Actualiza [`components/sections/AboutSection.vue`](components/sections/AboutSection.vue:14):
- Misión (línea 68)
- Visión (línea 80)
- Valores (línea 92)

---

## 🌐 Configurar SEO

### Meta Tags Principales
Edita [`pages/index.vue`](pages/index.vue:17):

```typescript
useHead({
  title: 'Tu Título SEO',
  meta: [
    {
      name: 'description',
      content: 'Tu descripción optimizada para SEO'
    },
    {
      name: 'keywords',
      content: 'palabra1, palabra2, palabra3'
    }
  ]
})
```

### Datos Estructurados
Actualiza [`pages/index.vue`](pages/index.vue:104) con tu información:
- Nombre del negocio
- Dirección
- Teléfono
- Horarios
- Servicios

### URL del Sitio
Cambia en [`nuxt.config.ts`](nuxt.config.ts:23):
```typescript
site: {
  url: 'https://tu-dominio.com',
  name: 'Tu Nombre'
}
```

---

## 🔗 Redes Sociales

### Footer
Actualiza los enlaces en [`components/layout/Footer.vue`](components/layout/Footer.vue:95):
```vue
<a href="https://facebook.com/tu-pagina">Facebook</a>
<a href="https://instagram.com/tu-cuenta">Instagram</a>
```

### Datos Estructurados
Actualiza en [`pages/index.vue`](pages/index.vue:195):
```typescript
sameAs: [
  'https://www.facebook.com/tu-pagina',
  'https://www.instagram.com/tu-cuenta',
  'https://twitter.com/tu-cuenta'
]
```

---

## 📊 Agregar Más Servicios

Para agregar un cuarto servicio en [`components/sections/ServicesSection.vue`](components/sections/ServicesSection.vue:107):

```typescript
{
  title: 'Nuevo Servicio',
  description: 'Descripción del nuevo servicio',
  icon: TuIcono, // Crear función de icono
  features: [
    'Característica 1',
    'Característica 2',
    'Característica 3'
  ]
}
```

---

## 🖼️ Agregar Imágenes

### Imágenes Estáticas
1. Coloca imágenes en `public/images/`
2. Referencia: `/images/tu-imagen.jpg`

### Imágenes Optimizadas
Usa el componente `NuxtImg`:
```vue
<NuxtImg 
  src="/images/tu-imagen.jpg" 
  alt="Descripción"
  width="800"
  height="600"
  format="webp"
/>
```

---

## 🎭 Personalizar Animaciones

Edita [`assets/css/main.css`](assets/css/main.css:1) para:
- Cambiar velocidad de animaciones (línea 95)
- Agregar nuevas animaciones
- Modificar efectos de hover

---

## 📱 Ajustar Responsive

### Breakpoints de Tailwind:
- `sm:` - 640px+
- `md:` - 768px+
- `lg:` - 1024px+
- `xl:` - 1280px+

Ejemplo:
```vue
<div class="text-base md:text-lg lg:text-xl">
  Texto responsive
</div>
```

---

## 🔧 Configuración Avanzada

### Agregar Google Analytics
```bash
npm install @nuxtjs/google-analytics
```

En [`nuxt.config.ts`](nuxt.config.ts:6):
```typescript
modules: [
  ['@nuxtjs/google-analytics', {
    id: 'UA-XXX-XXX'
  }]
]
```

### Agregar Google Maps
```bash
npm install @nuxtjs/google-maps
```

Reemplaza el placeholder del mapa en [`components/sections/ContactSection.vue`](components/sections/ContactSection.vue:107)

---

## ✅ Checklist de Personalización

Antes de desplegar, verifica:

- [ ] Número de WhatsApp actualizado
- [ ] Email de contacto correcto
- [ ] Logo personalizado
- [ ] Colores corporativos aplicados
- [ ] Contenido revisado y sin errores
- [ ] SEO configurado (título, descripción, keywords)
- [ ] Redes sociales enlazadas
- [ ] Información de contacto correcta
- [ ] Horarios actualizados
- [ ] Servicios descritos correctamente
- [ ] Imágenes optimizadas
- [ ] Probado en móvil y desktop

---

## 💡 Tips Adicionales

1. **Mantén la consistencia**: Usa los mismos colores y estilos en toda la página
2. **Optimiza imágenes**: Usa formatos WebP cuando sea posible
3. **Prueba en móviles**: La mayoría de usuarios visitarán desde móvil
4. **Actualiza regularmente**: Mantén el contenido fresco y relevante
5. **Monitorea el rendimiento**: Usa Google PageSpeed Insights

---

## 🆘 Ayuda

Si necesitas ayuda con la personalización:
- Revisa la [documentación de Nuxt.js](https://nuxt.com)
- Consulta la [documentación de Tailwind CSS](https://tailwindcss.com)
- Lee el [`README.md`](README.md:1) para más información

---

**¡Personaliza tu landing page y hazla única! 🎨**