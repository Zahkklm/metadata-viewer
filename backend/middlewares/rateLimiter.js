import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 1000, // 1 second window
  max: 5, // Limit each IP to 5 requests per second
});

export default limiter;
