# Base image dari Node.js LTS
FROM node:20-alpine

# Atur direktori kerja di dalam container
WORKDIR /app

# Salin package.json dan package-lock.json (untuk cache layer)
COPY package*.json ./

# Copy prisma schema first
COPY prisma ./prisma/

# Instal dependensi
RUN npm install

# Generate Prisma client with correct binary targets
RUN npx prisma generate

# Salin seluruh kode aplikasi Anda
COPY . .

# Copy Docker-specific environment file (after copying all files)
COPY .env.docker .env.local

# Build aplikasi Next.js untuk produksi
RUN npm run build

# Expose port yang digunakan Next.js
EXPOSE 3000

# Command untuk menjalankan aplikasi Next.js di production
CMD ["npm", "start"]