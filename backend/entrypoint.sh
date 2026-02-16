#!/bin/bash

echo "⏳ Aguardando banco..."

while ! nc -z db 5432; do
  sleep 1
done

echo "✅ Banco disponível!"

# Composer apenas se necessário
if [ ! -d "vendor" ]; then
  echo "📦 Instalando dependências..."
  composer install --no-interaction
fi

# APP KEY
if ! grep -q "APP_KEY=base64" .env; then
  echo "🔑 Gerando APP_KEY..."
  php artisan key:generate
fi

# Primeira inicialização
if [ ! -f ".docker_initialized" ]; then
  echo "🚀 Primeira subida - rodando migrations e seed..."

  php artisan migrate --force
  php artisan db:seed --force || true

  touch .docker_initialized
else
  echo "👌 Ambiente já inicializado."
fi

# Permissões
chown -R www-data:www-data storage bootstrap/cache

echo "🔥 PHP-FPM iniciado!"
exec php-fpm
