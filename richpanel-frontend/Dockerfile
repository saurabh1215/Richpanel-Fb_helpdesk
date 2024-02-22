# Use an official Node runtime as a parent image
FROM node:18 as build

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port on which your app will run
EXPOSE 3000

# Define environment variable (optional)

# Build the app
RUN npm run build

# Command to run your application
CMD ["npm", "start"]
