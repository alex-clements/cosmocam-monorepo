FROM node:18

# Install dependencies
RUN \
	set -x \
	&& apt-get update \
	&& apt-get install -y net-tools build-essential python3 python3-pip

WORKDIR /app

RUN NODE_ENV=development
RUN npm install typescript -g
RUN yarn global add lerna
COPY . .
RUN yarn
