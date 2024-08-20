// server.js

import https from "https";
import app from "./app.js"; // Import the Express app from the app.js file
import fs from "fs";

// Load SSL certificate and key
const options = {
  key: fs.readFileSync(new URL("./../certs/cert.key", import.meta.url)),
  cert: fs.readFileSync(new URL("./../certs/cert.crt", import.meta.url)),
};

const PORT = process.env.BACKEND_PORT || 5000;

// Start the server if this module is run directly
if (import.meta.url === new URL("file://" + process.argv[1]).href) {
  https.createServer(options, app).listen(PORT, () => {
    console.log(`Server running securely on https://localhost:${PORT}`);
  });
}
