# Stage 1: Build the React app
FROM node:16 AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first (for caching dependencies)
COPY package*.json ./

# Install only production dependencies (avoids unnecessary dev dependencies)
RUN npm install --only=production

# Copy the rest of the project
COPY . .

# Build the React app
RUN npm run build

# Stage 2: Serve the built app using a lightweight Node.js runtime
FROM node:16-alpine AS runtime

# Install `serve` to serve the static files
RUN npm install -g serve

# Copy the built React app from the previous stage
WORKDIR /app
COPY --from=build /app/build ./build

# Expose the port
EXPOSE 3000

# Start the application using `serve`
CMD ["serve", "-s", "build", "-l", "3000"]
