FROM node:22-alpine
WORKDIR /app
COPY package.json coach.js prompts.js validation.js server.js ./
COPY public ./public
USER node
ENV NODE_ENV=production PORT=3000
EXPOSE 3000
CMD ["node", "server.js"]
