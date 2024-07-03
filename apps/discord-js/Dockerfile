FROM node:20-alpine

# Create app directory
WORKDIR /home/app

# Install app dependencies
COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "app.js"]