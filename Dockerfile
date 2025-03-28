FROM node:20-bullseye

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the application port
EXPOSE 8080

# Start the application
CMD ["npm", "run", "start:dev"]
