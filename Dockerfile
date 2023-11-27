FROM node:18-alpine as builder
RUN rm -rf dist
ADD . /app/cart-api
COPY . /app/cart-api
WORKDIR /app/cart-api
ENV GENERATE_SOURCEMAP=false
RUN export NODE_OPTIONS=--max_old_space_size=8192
RUN npm install
RUN npm run build && npm cache clean --force

FROM node:18-alpine as prod
ENV NODE_ENV=production
COPY --from=builder /app/cart-api/dist /app/cart-api/dist
COPY --from=builder /app/cart-api/package*.json /app/cart-api/

WORKDIR /app/cart-api
RUN npm install
USER node

ENV PORT 4000
EXPOSE 4000
ENTRYPOINT ["node", "dist/main.js"]