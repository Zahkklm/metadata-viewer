import express from "express";
import axios from "axios";
import * as cheerio from "cheerio";
import validator from "validator";

const router = express.Router();

router.post("/fetch-metadata", async (req, res) => {
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
            statusCode = error.response.status;
            return {
              url,
              error: `Failed to fetch metadata: ${error.response.status}`,
            };
          } else if (error.request) {
            // Handle network errors
            statusCode = 500;
            return { url, error: "Failed to fetch metadata: Network error" };
          } else {
            // Handle other types of errors
            statusCode = 500;
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

export default router;
