FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# Install TypeScript globally to build (or use npm run build if script exists)
RUN npm install -g typescript ts-node

# Create directory for sessions
RUN mkdir -p auth_info_baileys

EXPOSE 4000

CMD ["npm", "run", "dev"] 
# For true production, you should compile TS to JS and run 'node dist/index.js'
# But 'ts-node' is fine for starting out.
