FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# import.meta.env VITE_ values are baked into the build: declare each one you use, e.g.
# ARG VITE_SITE_NAME
RUN npm run build

FROM node:24-alpine
WORKDIR /app
# Containify sets HOST=::, so react-router-serve listens on IPv6 and IPv4. PORT is the port
# the HTTP endpoint points at.
ENV NODE_ENV=production \
    PORT=3000
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/package.json ./
COPY --from=build /app/build ./build
COPY --from=build /app/migrations ./migrations
COPY --from=build /app/scripts ./scripts
USER node
EXPOSE 3000
CMD ["node_modules/.bin/react-router-serve", "./build/server/index.js"]
