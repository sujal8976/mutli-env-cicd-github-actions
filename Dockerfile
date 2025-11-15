FROM node:22.12.0-alpine3.20 AS builder
WORKDIR /app
COPY package*.json tsconfig.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22.12.0-alpine3.20
WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public

CMD [ "node", "dist/index.js"]