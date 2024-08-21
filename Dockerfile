# Stage 1: Build the frontend
FROM node:20 AS frontend-build

# Install serve globally
RUN npm install -g serve

# Set the working directory for the frontend
WORKDIR /frontend

# Copy frontend dependency manifests and install dependencies
COPY frontend/package*.json ./
RUN npm install

# Copy the rest of the frontend code
COPY frontend ./

# Build the frontend application
RUN npm run build

# Stage 2: Build the backend
FROM node:20 AS backend-build

# Set the working directory for the backend
WORKDIR /backend

# Copy backend dependency manifests and install dependencies
COPY backend/package*.json ./
RUN npm install

# Copy the rest of the backend code
COPY backend ./

# Stage 3: Final image
FROM node:20

# Install serve globally
RUN npm install -g serve

# Create directories for frontend and backend
RUN mkdir -p /frontend /backend

# Copy frontend build output
COPY --from=frontend-build /frontend/build /frontend

# Copy backend code
COPY --from=backend-build /backend /backend

# Expose ports
EXPOSE 80 5000

# Start both frontend and backend servers
CMD ["sh", "-c", "serve -s /frontend -l 80 & node --env-file=./.env /backend/index.js"]
