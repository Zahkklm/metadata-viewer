// app.js

import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import route from "./route.js"; // Import the route from route.js

// Initialize the Express application
const app = express();

// Apply security middleware
app.use(helmet());

// Disable 'X-Powered-By' header
app.disable("x-powered-by");

// CORS configuration
const corsOptions = {
  origin: ["https://localhost:3000"], // Restrict to your frontend's domain
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Apply rate limiting middleware
const limiter = rateLimit({
  windowMs: 1000, // 1 second window
  max: 5, // Limit each IP to 5 requests per second
});
app.use(limiter);

// Middleware to parse JSON bodies
app.use(express.json());

// Use the route from the route.js file
app.use(route);

export default app;
