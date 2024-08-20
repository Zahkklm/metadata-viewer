# Stage 1: Build the frontend
FROM node:20 AS frontend-build

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

# Install global packages
RUN npm install -g mkcert serve

# Create certification files after installation of global packages
WORKDIR /certs
RUN mkcert create-ca
RUN mkcert create-cert

WORKDIR /

# Stage 3: Final image
FROM node:20

# Install serve globally
RUN npm install -g serve

# Create directories for frontend and backend
RUN mkdir -p /frontend /backend /certs

# Copy frontend build output
COPY --from=frontend-build /frontend/build /frontend

# Copy backend code
COPY --from=backend-build /backend /backend
COPY --from=backend-build /certs /certs

# Set working directory to backend
WORKDIR /backend

# Expose ports
EXPOSE 3000 5000

# Start both frontend and backend servers
CMD ["sh", "-c", "serve -s /frontend -l 3000 & node --env-file=./../.env server.js"]
