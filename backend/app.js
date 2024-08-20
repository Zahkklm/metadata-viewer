import express from "express";
import helmet from "helmet";
import rateLimiter from "./middlewares/rateLimiter.js";
import corsMiddleware from "./middlewares/cors.js";
import metadataRoutes from "./routes/metadataRoutes.js";

const app = express();

// Apply security middleware
app.use(helmet());

// Disable 'X-Powered-By' header
app.disable("x-powered-by");

// Apply CORS middleware
app.use(corsMiddleware);

// Apply rate limiting middleware
app.use(rateLimiter);

// Middleware to parse JSON bodies
app.use(express.json());

// Register routes
app.use(metadataRoutes);

export default app;
