FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# We don't need 'RUN npm run build' for dev mode, but keeping it is fine.
# The important part is the command in docker-compose.
EXPOSE 3000

CMD ["npm", "run", "dev"]