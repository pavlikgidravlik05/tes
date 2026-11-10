# ЛР №18, задание 2: многоступенчатая сборка

# Этап 1 — установка всех зависимостей и сборка приложения
FROM node:22-bookworm-slim AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
ENV DATABASE_URL="postgresql://postgres:postgres@db:5432/nest_tasks_prisma?schema=public"
RUN npx prisma generate

COPY . .
RUN npm run build

# Этап 2 — установка только production-зависимостей
FROM node:22-bookworm-slim AS production-deps
WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

# Этап 3 — минимальный runtime-образ
FROM node:22-bookworm-slim AS production
WORKDIR /app
ENV NODE_ENV=production

COPY --from=production-deps /app/node_modules ./node_modules
# Копируем сгенерированный Prisma Client из build-этапа
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/package*.json ./

EXPOSE 3000
CMD ["node", "dist/main.js"]
