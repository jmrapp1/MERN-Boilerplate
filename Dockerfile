FROM node:8-alpine
WORKDIR .

# Copy everything
COPY . ./app

WORKDIR ./app

# Install dependencies
RUN npm install

RUN npm run postinstall
RUN npm run prod-client

RUN rm -rf src

EXPOSE 3000

# Run start command
CMD [ "npm", "run", "start" ]
