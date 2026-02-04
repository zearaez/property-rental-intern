# Use the official Node.js image as a base image
FROM node:18.17.0-alpine3.17

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the Node.js dependencies
RUN yarn global add nodemon
RUN yarn install

# Copy the rest of the application code
COPY . .

# Expose the port your application runs on
EXPOSE 3000
