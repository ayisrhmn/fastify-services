# Docker file disini saya pake bun

FROM oven/bun:latest

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl

COPY package.json bun.lockb* ./

RUN bun install

COPY . .

RUN bun run prisma-generate

RUN bun run build

EXPOSE 3333

CMD ["bun", "run", "start"]
