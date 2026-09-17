# Guía de Respaldo y Restauración de Base de Datos

Procedimientos para la protección y recuperación de datos de **Net & Soft Proposal Builder** en PostgreSQL.

---

## 1. Respaldo Manual (Backup)

Para generar una copia de seguridad completa con estructura y datos en formato comprimido:

```bash
docker compose exec postgres pg_dump -U proposal_user -d proposal_builder -F c -b -v -f /var/lib/postgresql/data/backup_$(date +%Y%m%d_%H%M%S).dump
```

Para extraer el archivo al host:
```bash
docker cp netandsoft-proposal-db:/var/lib/postgresql/data/backup_*.dump ./backups/
```

---

## 2. Automatización con Cron Diario

Cree un script en `/opt/scripts/backup_proposal_builder.sh`:

```bash
#!/bin/bash
BACKUP_DIR="/opt/backups/proposal_builder"
mkdir -p $BACKUP_DIR
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/proposal_db_$TIMESTAMP.sql.gz"

docker compose -f /opt/net-and-soft-solutions/proposal-builder/docker-compose.yml exec -T postgres pg_dump -U proposal_user proposal_builder | gzip > $BACKUP_FILE

# Eliminar respaldos más antiguos a 30 días
find $BACKUP_DIR -type f -name "*.sql.gz" -mtime +30 -delete
```

Asigne permisos de ejecución y configure el cron:
```bash
chmod +x /opt/scripts/backup_proposal_builder.sh
crontab -e
```
Agregue la siguiente línea para ejecutar diariamente a las 2:00 AM:
```cron
0 2 * * * /opt/scripts/backup_proposal_builder.sh > /dev/null 2>&1
```

---

## 3. Restauración de Base de Datos

Para restaurar una copia de seguridad:

1. Detener la aplicación temporalmente:
   ```bash
   docker compose stop app
   ```

2. Restaurar el dump:
   ```bash
   docker compose exec -T postgres dropdb -U proposal_user --if-exists proposal_builder
   docker compose exec -T postgres createdb -U proposal_user proposal_builder
   gunzip -c ./backups/proposal_db_YYYYMMDD_HHMMSS.sql.gz | docker compose exec -T postgres psql -U proposal_user -d proposal_builder
   ```

3. Reiniciar la aplicación:
   ```bash
   docker compose start app
   ```
