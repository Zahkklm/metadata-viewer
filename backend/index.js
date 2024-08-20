import app from "./app.js";

const PORT = process.env.BACKEND_PORT || 5000;

// Start the server if this module is run directly
if (import.meta.url === new URL("file://" + process.argv[1]).href) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
