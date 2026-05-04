FROM node:lts-alpine3.22
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --production
COPY . .
EXPOSE 3001
CMD ["yarn", "start:prod"]
