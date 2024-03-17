# Use an official Node.js runtime as the base image
FROM node:18-alpine

# Install Git
RUN apk update && \
    apk upgrade && \
    apk add --no-cache git

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the app's dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of your application code to the container
COPY . .

# Build the Next.js application (this is specific to Next.js)
RUN npm run build


# Expose the port that your Next.js app will run on
EXPOSE 8080

# Define the command to start your Next.js app
# CMD ["node", ".next/standalone/server.js"]
CMD ["npm", "start"]
