import express from "express";

import { auth } from "../middlewares/auth.middleware.js";

const aiRouter = express.Router();

import {
  generateArticle,
  generateBlogTitle,
  generateImage,
  removeImageBackground,
  removeImageObject,
  reviewResume,
} from "../controllers/aiController.js";
import { upload } from "../configs/multer.config.js";

aiRouter.post("/generate-article", auth, generateArticle);

aiRouter.post("/generate-blog-title", auth, generateBlogTitle);

aiRouter.post("/generate-image", auth, generateImage);

aiRouter.post(
  "/remove-image-background",
  auth,
  upload.single("image"),
  removeImageBackground,
);

aiRouter.post(
  "/remove-image-object",
  auth,
  upload.single("image"),
  removeImageObject,
);

aiRouter.post("/resume-review", auth, upload.single("resume"), reviewResume);

export default aiRouter;
