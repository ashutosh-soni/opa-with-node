FROM node:12.16.1-alpine3.10
RUN apk add --no-cache --virtual .gyp \
    python \
    make \
    curl \
    g++ \
    git
RUN apk add --no-cache bash
WORKDIR /zs-opa
COPY package.json package-lock.json /zs-opa/
RUN npm install --no-cache
COPY . /zs-opa/.
ENV PORT="3000"
EXPOSE ${PORT}
CMD ["npm", "start"]
