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

# Copy certificates
COPY certs /frontend/certs

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

# Copy certificates
COPY certs /certs

# Stage 3: Final image
FROM node:20

# Install serve globally
RUN npm install -g serve

# Create directories for frontend and backend
RUN mkdir -p /frontend /backend /certs

# Copy frontend build output and certificates
COPY --from=frontend-build /frontend/build /frontend
COPY --from=frontend-build /frontend/certs /frontend/certs

# Copy backend code and certificates
COPY --from=backend-build /backend /backend
COPY --from=backend-build /certs /certs

# Expose ports
EXPOSE 3000 5000

# Start both frontend and backend servers
CMD ["sh", "-c", "serve -s /frontend -l 3000 --ssl-cert /frontend/certs/cert.crt --ssl-key /frontend/certs/cert.key & node --env-file=./../.env /backend/server.js"]
