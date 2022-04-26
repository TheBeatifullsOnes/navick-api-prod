FROM node:16
# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install
RUN npm install -g nodemon

# Bundle app source
COPY . /usr/src/app
EXPOSE 8000
CMD [ "npm", "run", "dev" ]