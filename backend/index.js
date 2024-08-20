// Import required modules
import fs from "fs";
import https from "https";
import express from "express";
import axios from "axios";
import * as cheerio from "cheerio";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";
import validator from "validator";

// Initialize the Express application
const app = express();
const PORT = process.env.BACKEND_PORT || 5000;

// Load SSL certificate and key
const options = {
  key: fs.readFileSync(new URL("./../certs/cert.key", import.meta.url)),
  cert: fs.readFileSync(new URL("./../certs/cert.crt", import.meta.url)),
};

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

// Route to fetch metadata from provided URLs
app.post("/fetch-metadata", async (req, res) => {
  const urls = req.body.urls;

  // Validate input URLs
  if (!Array.isArray(urls) || urls.length < 3) {
    return res.status(400).json({ error: "Please provide at least 3 URLs" });
  }

  if (!urls.every((url) => validator.isURL(url))) {
    return res.status(400).json({ error: "Invalid URL(s) provided" });
  }

  try {
    let statusCode;
    const metadata = await Promise.all(
      urls.map(async (url) => {
        try {
          const { data } = await axios.get(url, { timeout: 5000 }); // Timeout after 5 seconds
          const $ = cheerio.load(data);
          const title = $("title").text();
          const description = $('meta[name="description"]').attr("content");
          const image = $('meta[property="og:image"]').attr("content");
          statusCode = 200;
          return { url, title, description, image };
        } catch (error) {
          if (error.code === "ECONNABORTED") {
            // Handle timeout error
            statusCode = 429;
            return {
              url,
              error: "Failed to fetch metadata: Request timed out",
            };
          } else if (error.response) {
            // Handle HTTP response errors
            statusCode = error.response.statusCode;
            return {
              url,
              error: `Failed to fetch metadata: ${error.response.status}`,
            };
          } else if (error.request) {
            // Handle network errors
            statusCode = error.response.statusCode;
            return { url, error: "Failed to fetch metadata: Network error" };
          } else {
            // Handle other types of errors
            statusCode = error.response.statusCode;
            return { url, error: "Failed to fetch metadata: Unknown error" };
          }
        }
      }),
    );

    // Send response with status code and metadata
    if (statusCode !== undefined) {
      res.status(statusCode).json(metadata);
    }
  } catch (error) {
    console.error("Server error:", error); // Log the error for debugging
    res.status(500).json({ error: "Server error" });
  }
});

// Start the server if this module is run directly
if (import.meta.url === new URL("file://" + process.argv[1]).href) {
  // Create HTTPS server
  https.createServer(options, app).listen(PORT, () => {
    console.log(`Server running securely on https://localhost:${PORT}`);
  });
}

// Export the Express application for use in other modules
export default app;
