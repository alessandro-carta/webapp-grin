FROM node:20
WORKDIR /Backend
COPY package.json .
RUN npm install
COPY . .
CMD ["npm", "start"]