FROM node:20-alpine AS base

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./


FROM base AS deps
RUN yarn install --frozen-lockfile

FROM base as dev
COPY --from=deps /app/node_modules ./node_modules
COPY . .

EXPOSE 3000
CMD [ "yarn", "dev"]



FROM base as builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN  yarn build



FROM node:20-alpine AS prod
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["node", "server.js"]
