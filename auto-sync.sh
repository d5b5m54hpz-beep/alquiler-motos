#!/bin/bash

# Auto-sync script para Git
# Sincroniza cambios automáticamente cada X segundos

SYNC_INTERVAL=30  # Cambios cada 30 segundos
LOG_FILE="git-sync.log"

echo "🚀 Iniciando auto-sync de Git..."
echo "📁 Directorio: $(pwd)"
echo "⏱️  Intervalo: ${SYNC_INTERVAL} segundos"
echo "📝 Log: $LOG_FILE"
echo ""

while true; do
  TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
  
  # Pull de cambios remotos
  echo "[$TIMESTAMP] 📥 Pulling cambios..." >> "$LOG_FILE"
  git pull origin main 2>&1 | grep -v "Already up to date" >> "$LOG_FILE" 2>&1
  
  # Agregar cambios locales
  echo "[$TIMESTAMP] ➕ Agregando cambios..." >> "$LOG_FILE"
  git add -A 2>&1 >> "$LOG_FILE"
  
  # Commit si hay cambios
  if ! git diff-index --quiet HEAD --; then
    COMMIT_MSG="Auto-sync: $(date '+%Y-%m-%d %H:%M:%S')"
    echo "[$TIMESTAMP] 💾 Commit: $COMMIT_MSG" >> "$LOG_FILE"
    git commit -m "$COMMIT_MSG" 2>&1 >> "$LOG_FILE"
  fi
  
  # Push de cambios
  echo "[$TIMESTAMP] 📤 Pushing cambios..." >> "$LOG_FILE"
  git push origin main 2>&1 >> "$LOG_FILE"
  
  # Status
  CHANGES=$(git status --porcelain | wc -l)
  echo "[$TIMESTAMP] ✅ Sync completado. Cambios pendientes: $CHANGES" >> "$LOG_FILE"
  
  # Mostrar progreso en pantalla
  echo "[$TIMESTAMP] Sync completado. Cambios: $(git diff-index --quiet HEAD -- && echo '0' || echo '1+')"
  
  # Esperar
  sleep "$SYNC_INTERVAL"
done
