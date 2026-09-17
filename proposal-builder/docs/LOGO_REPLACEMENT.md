# Guía para Sustituir Logotipos e Isotipos Corporativos

Instrucciones para actualizar o reemplazar los recursos gráficos de marca de **Net & Soft Solutions** en la aplicación.

---

## 1. Ubicación de los Recursos de Marca

Todos los archivos vectoriales oficiales se almacenan localmente en la carpeta:
`/public/brand/`

Los archivos requeridos son:

| Archivo | Uso | Dimensiones / Formato |
|---|---|---|
| `netandsoft-logo-light.svg` | Logotipo horizontal para fondos claros | SVG vectorial (220x48 viewBox) |
| `netandsoft-logo-dark.svg` | Logotipo horizontal para fondos oscuros | SVG vectorial (220x48 viewBox) |
| `netandsoft-icon.svg` | Isotipo (Rompecabezas / Llaves) | SVG vectorial (cuadrado 124x124) |
| `favicon.ico` | Ícono de pestaña del navegador | ICO multiresolución (16x16, 32x32) |

---

## 2. Paleta Oficial de Colores Corporativos

Al crear o exportar nuevas variantes vectoriales del logotipo, asegúrese de utilizar los códigos hexadecimales oficiales:

- **Azul Oscuro Tecnológico**: `#022B3A`
- **Turquesa / Cian Secundario**: `#1F7A8C`
- **Acento Luminoso / Cian de Acción**: `#0EA5E9` (o `#38BDF8`)
- **Acento Hielo**: `#BFDBF7`
- **Blanco Puro**: `#FFFFFF`

---

## 3. Pasos para Reemplazar los Archivos

1. Prepare sus archivos SVG manteniendo la estructura de nombres especificada arriba.
2. Copie los archivos a la carpeta `public/brand/`:
   ```bash
   cp mi-nuevo-logo-dark.svg public/brand/netandsoft-logo-dark.svg
   cp mi-nuevo-logo-light.svg public/brand/netandsoft-logo-light.svg
   cp mi-nuevo-icono.svg public/brand/netandsoft-icon.svg
   ```
3. Si la aplicación está desplegada en Docker:
   ```bash
   docker compose restart app
   ```
4. El componente `<Logo />` ubicado en `src/components/brand/Logo.tsx` cargará automáticamente los nuevos gráficos en todas las pantallas del panel y las propuestas públicas.
