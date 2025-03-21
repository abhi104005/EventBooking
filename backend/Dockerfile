# Use a lightweight Node.js Alpine image
FROM node:16-alpine

# Set the working directory
WORKDIR /app

# Copy package files first for caching
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy the rest of the application
COPY . .

# Expose the application port
EXPOSE 8080

# Start the application (Fix CMD syntax)
CMD ["node", "server.js"]
