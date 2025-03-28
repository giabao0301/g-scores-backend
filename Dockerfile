# Use Node.js LTS version
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the entire source code
COPY . .

# Expose the application port
EXPOSE 8080

# Start the NestJS application
CMD ["npm", "run", "start:dev"]
