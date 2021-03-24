FROM node:14.15.4-alpine

WORKDIR /app
COPY ./package.json .
RUN npm install
RUN npm audit fix
COPY . .

CMD ["npm", "run", "serve"]