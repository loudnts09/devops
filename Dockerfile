FROM node:22
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
ENV NODE_ENV=production
CMD ["npm", "start"]
EXPOSE 3000