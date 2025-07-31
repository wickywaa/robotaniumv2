ARG RUN_MODE=dev


## Build Stage ##

FROM node:16.10 as build

WORKDIR /app
ADD ./ /app
RUN npm install
RUN npm run build

FROM build as dev 
CMD ["sh", "-c", "npm start"]

FROM dev