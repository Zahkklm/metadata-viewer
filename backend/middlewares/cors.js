import cors from "cors";

const corsOptions = {
  origin: ["http://localhost:3000"], // Restrict to your frontend's domain
  optionsSuccessStatus: 200,
};

export default cors(corsOptions);
