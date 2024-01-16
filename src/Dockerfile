FROM node:slim

ARG BWS_VERSION=0.4.0 
ARG NODE_ENV=production 
ARG PORT=8080

WORKDIR /opt/app

ADD https://github.com/bitwarden/sdk/releases/download/bws-v${BWS_VERSION}/bws-x86_64-unknown-linux-gnu-${BWS_VERSION}.zip /tmp/bws.zip

COPY . .

RUN apt update && apt install -y unzip ca-certificates && unzip /tmp/bws.zip -d /usr/local/bin && rm -rf /tmp/* && \
    chmod +x /usr/local/bin && apt purge -y unzip && apt clean && \
    rm -rf /var/lib/apt/lists/* && \
    npm install --only=prod

ENV NODE_ENV=$NODE_ENV PORT=$PORT BWS_ACCESS_TOKEN= 

EXPOSE $PORT

CMD [ "node", "index.js" ]