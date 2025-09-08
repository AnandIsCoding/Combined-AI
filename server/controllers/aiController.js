import { clerkClient } from "@clerk/express";
import axios from "axios";
import chalk from "chalk";
import { v2 as cloudinary } from "cloudinary";
import FormData from "form-data";
import { StatusCodes } from "http-status-codes";
import OpenAI from "openai";
import fs from "fs";

import sql from "../configs/database.config.js";
import { CLIPDROP_API_KEY, GEMINI_API_KEY } from "../configs/server.config.js";
import pdf from "pdf-parse/lib/pdf-parse.js";

const AI = new OpenAI({
  apiKey: GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

// Generate Article using Gemini openai

export const generateArticle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, length } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (plan !== "premium" && free_usage >= 10) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message:
          "You have exhausted your free usage. Please upgrade to premium plan.",
      });
    }
    if (!prompt || !length) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: "Prompt and length are required" });
    }
    // Calling AI service Gemini here to generate the article
    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: length,
    });
    const content = response.choices[0].message.content;
    await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${prompt}, ${content}, 'article')`;
    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }
    // send response

    return res.status(StatusCodes.OK).json({
      success: true,
      content,
      message: "Article Generated Successfully",
    });
  } catch (error) {
    console.log(
      chalk.bgRed("Error in aiController.js in GenerateArticle controllers"),
      error,
    );
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// Generate Blog Title using Gemini openai

export const generateBlogTitle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;


    if (plan !== "premium" && free_usage >= 10) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message:
          "You have exhausted your free usage. Please upgrade to premium plan.",
      });
    }
    if (!prompt) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: "Prompt is required" });
    }
    // Calling AI service Gemini here to generate the article
    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 100,
    });
    const content = response.choices[0].message.content;
    await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${prompt}, ${content}, 'blog-title')`;
    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }
    // send response

    return res.status(StatusCodes.OK).json({
      success: true,
      content,
      message: "Blog Title Generated Successfully",
    });
  } catch (error) {
    console.log(
      chalk.bgRed("Error in aiController.js in generateBlogTitle controllers"),
      error,
    );
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// generate image

export const generateImage = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, publish } = req.body;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: "This feature is only available for premium Subscriptions ",
      });
    }
    if (!prompt) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: "Prompt is required" });
    }
    // Calling clipdrop ai for image generation

    //Prepare form data
    const formData = new FormData();
    formData.append("prompt", prompt);

    // Calling clipdrop
    const { data } = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: {
          "x-api-key": CLIPDROP_API_KEY,
        },
        responseType: "arraybuffer", // Ensures we handle binary data
      },
    );

    // Convert binary response to base64
    const base64Image = `data:image/png;base64,${Buffer.from(data, "binary").toString("base64")}`;
    const { secure_url } = await cloudinary.uploader.upload(base64Image, {
      folder: "CombinedAi",
    });

    await sql`INSERT INTO creations (user_id, prompt, content, type, publish) VALUES (${userId}, ${prompt}, ${secure_url}, 'image', ${publish ?? false})`;
    // send response

    return res.status(StatusCodes.OK).json({
      success: true,
      content: secure_url,
      message: "Image Generated Successfully",
    });
  } catch (error) {
    console.log(
      chalk.bgRed("Error in aiController.js in generateImage controllers"),
      error,
    );
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// remove image's background removeImageBackground )

export const removeImageBackground = async (req, res) => {
  try {
    const { userId } = req.auth();
    const  image = req.file;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: "This feature is only available for premium Subscriptions ",
      });
    }
    if (!image) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: "Image is required" });
    }

    const { secure_url } = await cloudinary.uploader.upload(image.path, {
      folder: "CombinedAi",
      transformation: [
        {
          effect: "background_removal",
          background_removal: "remove_the_background",
        },
      ],
    });

   const prompt = 'Remove Background from image';

await sql`
  INSERT INTO creations (user_id, prompt, content, type)
  VALUES (${userId}, ${prompt}, ${secure_url}, 'image')
`;

    // send response

    return res.status(StatusCodes.OK).json({
      success: true,
      content: secure_url,
      message: "Background removed Successfully",
    });
  } catch (error) {
    console.log(
      chalk.bgRed(
        "Error in aiController.js in removeImageBackground controllers",
      ),
      error,
    );
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// remove image object

export const removeImageObject = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { object } = req.body;
    const  image = req.file;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: "This feature is only available for premium Subscriptions ",
      });
    }
    if (!image || !object) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: "Image and object are required" });
    }

    const { public_id } = await cloudinary.uploader.upload(image?.path, {
      folder: "CombinedAi",
    });

    const imageUrl = cloudinary.url(public_id, {
      transformation: [{ effect: `gen_remove:${object}` }],
      resource_type: "image",
    });

await sql`
  INSERT INTO creations (user_id, prompt, content, type)
  VALUES (${userId}, ${`remove ${object} from image`}, ${imageUrl}, 'image')
`;

    // send response

    return res.status(StatusCodes.OK).json({
      success: true,
      content: imageUrl,
      message: "Image removed Successfully",
    });
  } catch (error) {
    console.log(
      chalk.bgRed("Error in aiController.js in removeImageObject controllers"),
      error,
    );
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// resume review

export const reviewResume = async (req, res) => {
  try {
    const { userId } = req.auth();
    const resume = req.file;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: "This feature is only available for premium Subscriptions ",
      });
    }
    if (!resume) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: "Resume pdf is required" });
    }

    // check file size
    if (resume?.size > 5 * 1024 * 1024) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: "Resume File Size exceeds allowed size (5MB)",
      });
    }

    // create buffer
    const dataBuffer = fs.readFileSync(resume.path);
    const pdfData = await pdf(dataBuffer);

    const prompt = `Review the following resume and provide constructive feedback on its strengths, weaknesses and areas for improvement. Resume Content :\n\n${pdfData.text}`;

    // gemini call
    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });
    const content = response.choices[0].message.content;

    await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, 'Review Uploaded Resume', ${content}, 'resume-review')`;
    // send response

    return res.status(StatusCodes.OK).json({
      success: true,
      content,
      message: "Resume Reviewed Successfully",
    });
  } catch (error) {
    console.log(
      chalk.bgRed("Error in aiController.js in reviewResume controller"),
      error,
    );
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "Internal Server Error" });
  }
};
