FROM node:16
# Create app dir
WORKDIR /opt/foxbot

# Install pkgs
COPY package*.json ./

RUN npm install

COPY . .

CMD npm start