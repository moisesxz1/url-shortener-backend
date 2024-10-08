# Use the official Node.js image
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the entire source code into the container
COPY . .

# Expose the application port
EXPOSE 3000

# Build the application before starting
RUN npm run build

# Start the application in production mode
CMD ["npm", "run", "start:prod"]
