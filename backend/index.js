import fs from 'fs';
import http from 'http';
import express from 'express';
import cors from 'cors';
import helmetConfig from './middleware/helmetConfig.js';
import rateLimitConfig from './middleware/rateLimitConfig.js';
import corsOptions from './config/corsOptions.js';
import metadataRoutes from './routes/metadataRoutes.js';

const app = express();
const PORT = process.env.BACKEND_PORT || 5000;

// Security middleware
app.use(helmetConfig);

// Disable 'X-Powered-By' header
app.disable('x-powered-by');

// CORS configuration
app.use(cors(corsOptions));

// Rate limiting
app.use(rateLimitConfig); // Uncomment if you want to enable rate limiting

// Middleware to parse JSON bodies
app.use(express.json());

// Routes
app.use(metadataRoutes);

// Create HTTP server
http.createServer(app).listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
