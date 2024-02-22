# Use an official Node.js runtime as a base image
FROM node:18 as build

# Set the working directory in the container
WORKDIR /usr/src/app

# Install build tools
RUN apt-get update && apt-get install -y build-essential

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the application code to the container
COPY . .

# Expose the port that the application will run on
EXPOSE 8000
EXPOSE 3001
# Rebuild bcrypt inside the container
RUN npm rebuild bcrypt --build-from-source

# Define the command to run your application
CMD ["npm", "start"]
