FROM node:latest
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN node --run build
EXPOSE 3000
CMD ["node", "--run", "start"]