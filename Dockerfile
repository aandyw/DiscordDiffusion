# multi-stage docker build

FROM node:20-alpine AS base

WORKDIR /home/
COPY package*.json .
COPY ./src/ ./src/

EXPOSE 3000


FROM base AS production

ENV NODE_ENV=production
RUN npm ci --omit=dev
CMD ["npm", "start"]


FROM base AS development

ENV NODE_ENV=development
RUN npm ci
CMD ["npm", "run", "dev"]