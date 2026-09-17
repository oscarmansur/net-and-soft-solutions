# Guía de Despliegue en Subdominio

Instrucciones completas para publicar **Net & Soft Proposal Builder** en:
`https://cotiza.netandsoft.com.ve`.

---

## 1. Configuración de Registros DNS

En el panel de administración DNS de `netandsoft.com.ve`:

1. Añadir registro tipo **A**:
   - **Nombre / Host**: `cotiza`
   - **Tipo**: `A`
   - **Valor / IP**: `[IP_PÚBLICA_DEL_SERVIDOR]`
   - **TTL**: 300 segundos (o automático)

2. Validar propagación:
   ```bash
   dig +short cotiza.netandsoft.com.ve
   ```

---

## 2. Preparación del Servidor (Ubuntu / Debian)

1. Actualizar paquetes e instalar Docker y Docker Compose:
   ```bash
   sudo apt-get update && sudo apt-get upgrade -y
   sudo apt-get install -y docker.io docker-compose-v2 certbot
   sudo usermod -aG docker $USER
   ```

2. Clonar el repositorio y navegar a la carpeta de la aplicación:
   ```bash
   cd /opt/net-and-soft-solutions/proposal-builder
   ```

3. Crear y ajustar las variables de entorno de producción:
   ```bash
   cp .env.example .env
   nano .env
   ```
   *Asegúrese de establecer contraseñas seguras y claves aleatorias para `AUTH_SECRET` y `FORM_TOKEN_SECRET` (`openssl rand -hex 32`).*

---

## 3. Emisión del Certificado SSL con Let's Encrypt

Antes de levantar el Nginx final, obtenga el certificado SSL inicial:
```bash
sudo certbot certonly --standalone -d cotiza.netandsoft.com.ve --email admin@netandsoft.com.ve --agree-tos --non-interactive
```

Los certificados se guardarán en `/etc/letsencrypt/live/cotiza.netandsoft.com.ve/`.

---

## 4. Despliegue con Docker Compose

1. Iniciar los contenedores:
   ```bash
   docker compose up -d --build
   ```

2. Verificar el estado de los servicios:
   ```bash
   docker compose ps
   ```

3. Ejecutar las migraciones de base de datos dentro del contenedor:
   ```bash
   docker compose exec app npx prisma migrate deploy
   ```

4. Cargar los datos iniciales y propuesta de demostración:
   ```bash
   docker compose exec app npm run prisma:seed
   ```

5. (Opcional) Crear o restablecer un administrador específico:
   ```bash
   docker compose exec app npx tsx scripts/create-admin.ts admin@netandsoft.com.ve TuClaveSegura2026! "Administrador Net & Soft"
   ```

---

## 5. Monitoreo y Logs

- Ver logs de la aplicación en tiempo real:
  ```bash
  docker compose logs -f app
  ```
- Ver logs de acceso y errores de Nginx:
  ```bash
  docker compose logs -f nginx
  ```
- Ver logs de base de datos PostgreSQL:
  ```bash
  docker compose logs -f postgres
  ```

---

## 6. Procedimiento de Actualización

### A. Rutina Watchdog del Servidor
Al estar incorporado el repositorio en la rutina del watchdog `/usr/local/bin/git-watchdog.sh`, el servidor sincroniza automáticamente las actualizaciones del upstream de GitHub mediante `git fetch` y `git reset --hard @{u}`.

### B. Actualización Manual
```bash
cd /home/projects/net-and-soft-solutions/proposal-builder
git pull origin master
docker compose up -d --build app
docker compose exec app npx prisma migrate deploy
```

---

## 7. Procedimiento de Rollback

En caso de requerir volver a la versión anterior:
```bash
git checkout [COMMIT_ANTERIOR]
docker compose up -d --build app
```
