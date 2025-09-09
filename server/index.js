import { clerkMiddleware, requireAuth } from "@clerk/express";
import chalk from "chalk";
import cors from "cors";
import express from "express";
import { StatusCodes } from "http-status-codes";

import connectCloudinary from "./configs/cloudinary.config.js";
import { PORT } from "./configs/server.config.js";
import aiRouter from "./routes/airoutes.js";
import userRouter from "./routes/userRoutes.js";

const app = express();

await connectCloudinary();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:7000",
  "https://mycombinedai.vercel.app"
];
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));
app.use(clerkMiddleware());

// app.use(requireAuth());

app.get("/", (req, res) => {
  return res.status(StatusCodes.OK).send("Server is up and running ");
});




app.use("/api/v1/ai", requireAuth(), aiRouter);
app.use("/api/v1/user", requireAuth(), userRouter);


app.listen(PORT, () => {
  console.log(
    chalk.bgMagentaBright(`server is running on http://localhost:${PORT}`),
  );
});


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ message: "Something went wrong!" });
});

export default app