FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

# install only prod deps + global sequelize-cli
RUN npm install --omit=dev && npm install -g sequelize-cli

COPY . .

CMD ["node", "src/server.js"]