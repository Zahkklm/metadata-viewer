// route.js

import express from "express";
import { fetchMetadata } from "./controller.js"; // Import the fetchMetadata function

const router = express.Router();

// Route to fetch metadata from provided URLs
router.post("/fetch-metadata", fetchMetadata);

export default router;
