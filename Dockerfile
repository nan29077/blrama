FROM node:24-bookworm-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --ignore-scripts
COPY . .
RUN npm run build

FROM node:24-bookworm-slim AS runtime
WORKDIR /app
# 업로드·데이터 폴더는 컨테이너 밖(볼륨)에 두어 재배포해도 사라지지 않게 합니다. 웹 서버와 worker가 같은 값을 써야 해요.
ENV NODE_ENV=production HOST=0.0.0.0 PORT=3036 ENABLE_DEMO=false UPLOAD_DIR=/app/uploads/bellama DATA_DIR=/app/data
COPY package*.json ./
RUN apt-get update && apt-get install -y --no-install-recommends ffmpeg && rm -rf /var/lib/apt/lists/*
RUN npm ci --omit=dev --ignore-scripts && mkdir -p /app/uploads/bellama /app/data && chown -R node:node /app
COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=build --chown=node:node /app/public ./public
COPY --chown=node:node server ./server
COPY --chown=node:node scripts/promote-admin.mjs ./scripts/promote-admin.mjs
VOLUME ["/app/uploads", "/app/data"]
USER node
EXPOSE 3036
HEALTHCHECK --interval=30s --timeout=5s CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3036)+'/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "server/index.mjs", "--production"]
