FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY models/ ./models/
COPY .env .
COPY . .
EXPOSE 5000
CMD ["node", "./server/server.mjs"]
