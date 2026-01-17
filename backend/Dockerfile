# Base stage
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
COPY tsconfig*.json ./

# Development stage
FROM base AS dev
RUN npm install
COPY . .
# Create uploads directory
RUN mkdir -p uploads/tmp
CMD ["npm", "run", "dev"]

# Builder stage
FROM base AS builder
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS prod
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/config ./dist/config
RUN mkdir -p uploads/tmp
EXPOSE 8080
CMD ["npm", "start"]