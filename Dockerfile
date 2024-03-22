# Use an appropriate Node.js base image
# FROM node:18-alpine3.18

FROM node:16-slim
RUN apt-get update
RUN apt-get install -y openssl

# Create a working directory
WORKDIR /app

# Install dependencies
# COPY package.json package-lock.json keystone.ts ./
COPY . .

RUN npm install

# Copy the rest of your application code
# COPY . .

# Expose the port Keystone runs on 
EXPOSE 3001

# Command to start your Keystone.js application in development mode
RUN npm run build
CMD ["npm", "run", "start"] 