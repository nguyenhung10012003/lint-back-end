FROM node:20

WORKDIR /app

COPY yarn.lock package.json ./ 

RUN yarn install

COPY . .

RUN yarn run prisma:all

RUN yarn run build

EXPOSE 8000