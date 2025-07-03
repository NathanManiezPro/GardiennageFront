# === Build stage ===
FROM node:18-alpine AS builder
WORKDIR /app

# 1) Copie des dépendances
COPY package.json package-lock.json ./
RUN npm ci

# 2) Copie du code et build de l’app
COPY . .
RUN npm run build

# === Production stage ===
FROM nginx:stable-alpine
# On écrase la conf par défaut pour router sur index.html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# On déploie le build
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
