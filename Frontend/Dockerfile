# Fase de construcción (Node)
FROM node:20-alpine AS build
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# SOLUCIÓN: Forzar la instalación limpia, rápida y segura para entornos Docker
RUN npm ci --quiet

# Copiar código fuente y construir la app
COPY . ./
RUN npm run build

# Fase de producción (Nginx)
FROM nginx:alpine
# Copiar el build generado por Vite a la carpeta pública de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]