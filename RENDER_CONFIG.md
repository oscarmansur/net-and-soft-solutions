# ⚙️ Configuración de Render - Campos Requeridos

## 📋 Configuración Manual en Render

Si estás configurando manualmente (sin usar render.yaml), usa estos valores exactos:

### Campos Requeridos

| Campo | Valor | Notas |
|-------|-------|-------|
| **Name** | `net-and-soft-solutions` | Nombre del servicio |
| **Language** | `Node` | Seleccionar del dropdown |
| **Branch** | `main` o `master` | Tu rama principal |
| **Root Directory** | *(dejar vacío)* | Opcional |
| **Build Command** | `npm install && npm run build` | **SIN el símbolo $** |
| **Start Command** | `npm run start` | **SIN el símbolo $** |

### Variables de Entorno (Opcional)

```
NODE_VERSION=18.17.0
NODE_ENV=production
```

## ⚠️ Errores Comunes

### ❌ INCORRECTO
```bash
$ npm run start          # NO incluir el símbolo $
$ yarn start            # NO incluir el símbolo $
npm run generate        # Esto es para sitios estáticos, no para servidor
```

### ✅ CORRECTO
```bash
npm run start           # Correcto para npm
```

O si prefieres yarn:
```bash
yarn start              # Correcto para yarn
```

## 🔄 Diferencia entre Build Commands

### Para Servidor Node.js (Recomendado)
```
Build Command: npm install && npm run build
Start Command: npm run start
```
- Genera un servidor Node.js
- Puede manejar rutas dinámicas
- Mejor para aplicaciones con backend

### Para Sitio Estático
```
Build Command: npm install && npm run generate
Start Command: (no necesario)
```
- Genera archivos HTML estáticos
- Solo para sitios sin backend
- Más económico pero menos flexible

## 📝 Pasos Exactos

1. **New + → Web Service**
2. **Conectar repositorio**
3. **Llenar campos:**
   - Name: `net-and-soft-solutions`
   - Language: `Node`
   - Branch: `main`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start`
4. **Click "Create Web Service"**

## 🎯 Verificación

Después de desplegar, verifica:
- ✅ Build completado sin errores
- ✅ Servidor iniciado correctamente
- ✅ Sitio accesible en la URL de Render
- ✅ Todas las páginas cargan correctamente

## 💡 Tip

Si ves el error "Start Command is required", asegúrate de:
1. NO incluir el símbolo `$`
2. Usar exactamente: `npm run start`
3. Verificar que el campo no esté vacío

---

**¿Necesitas ayuda?** Revisa los logs en Render Dashboard → Tu Servicio → Logs