# Stage 1: Build
FROM oven/bun:1.4.2-alpine AS builder

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_FRONTEND_BASE_URL
ARG NEXT_PUBLIC_IMAGEBB_API_KEY
ARG NEXT_PUBLIC_IMAGEBB_API_LINK

ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_FRONTEND_BASE_URL=$NEXT_PUBLIC_FRONTEND_BASE_URL
ENV NEXT_PUBLIC_IMAGEBB_API_KEY=$NEXT_PUBLIC_IMAGEBB_API_KEY
ENV NEXT_PUBLIC_IMAGEBB_API_LINK=$NEXT_PUBLIC_IMAGEBB_API_LINK

RUN bun run build


# Stage 2: Production
FROM oven/bun:1.4.2-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 3000

CMD ["node", "server.js"]
