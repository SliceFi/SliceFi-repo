# Use official Node.js image (version 18 or higher)
FROM node:18

# Set up working directory
WORKDIR /app

# Install dependencies for native module compilation
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    libc6-dev \
    libstdc++6 \
    && rm -rf /var/lib/apt/lists/*


# Install pnpm globally
RUN npm install -g pnpm

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy the rest of your application files
COPY . .

# Expose port if needed (optional)
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
