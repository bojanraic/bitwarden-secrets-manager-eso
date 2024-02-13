ARG ARCH=amd64 \
    BWS_VERSION=0.4.0 \
    BWS_DL_ARCH=x86_64 \
    NODE_ENV=production \
    PORT=8080 \
    WORKDIR=/app

FROM --platform=linux/${ARCH} cgr.dev/chainguard/node-lts as base
ARG WORKDIR BWS_DL_ARCH
WORKDIR $WORKDIR
COPY . .
ENV NODE_ENV=$NODE_ENV \
    PORT=$PORT \
    BWS_ACCESS_TOKEN= 
RUN npm ci --omit=dev

FROM --platform=linux/${ARCH} busybox:stable-uclibc as bws

ARG BWS_VERSION WORKDIR BWS_DL_ARCH
WORKDIR $WORKDIR

ADD https://github.com/bitwarden/sdk/releases/download/bws-v${BWS_VERSION}/bws-${BWS_DL_ARCH}-unknown-linux-gnu-${BWS_VERSION}.zip /tmp/bws.zip
RUN unzip /tmp/bws.zip -d . && rm -rf /tmp/* && chmod +x ./bws

FROM --platform=linux/${ARCH} cgr.dev/chainguard/node-lts as runner 
ARG WORKDIR NODE_ENV PORT
ENV WORKDIR=$WORKDIR \
    BWS_CLI_PATH=$WORKDIR/bws \
    NODE_ENV=$NODE_ENV \
    PORT=$PORT

WORKDIR $WORKDIR

COPY --from=base $WORKDIR/ $WORKDIR/
COPY --from=bws /bin/sh /bin/sh
COPY --from=bws /bin/wget /bin/wget
COPY --from=bws $WORKDIR/bws $WORKDIR/bws

EXPOSE $PORT
USER node

CMD [ "index.js" ]
