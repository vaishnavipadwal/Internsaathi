# Use an official lightweight Node.js image
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

ENV PORT=5000

EXPOSE 5000

CMD ["npm", "start"]
