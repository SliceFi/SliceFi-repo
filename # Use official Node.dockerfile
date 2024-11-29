# Use official Node.js image
FROM node:16

# Set up working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --legacy-peer-deps

# Copy the rest of your application files
COPY . /app

# Expose port if needed (optional)
EXPOSE 3000

# Command to run the application (adjust to your app's start command)
CMD ["npm", "start"]
