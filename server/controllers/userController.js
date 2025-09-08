import chalk from "chalk";
import { StatusCodes } from "http-status-codes";
import sql from "../configs/database.config.js";

// get logged in user's creations
export const getUserCreations = async (req, res) => {
  try {
    const { userId } = req.auth();

    const creations =
      await sql`SELECT * FROM creations WHERE user_id = ${userId} ORDER BY created_at DESC`;
    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Creations fetched successfully",
      creations,
    });
  } catch (error) {
    console.log(
      chalk.bgRed("Error in userController.js in getUserCreations function"),
      error,
    );
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// get published creations

export const getPublishedCreations = async (req, res) => {
  try {
    const creations =
      await sql`SELECT * FROM creations WHERE publish = true  ORDER BY created_at DESC`;
    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Published Creations fetched successfully",
      creations,
    });
  } catch (error) {
    console.log(
      chalk.bgRed(
        "Error in userController.js in getPublishedCreations function",
      ),
      error,
    );
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const toggleLikeCreation = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.body;

    // fetch creation
    const [creation] = await sql`
      SELECT * FROM creations WHERE id = ${id}
    `;

    if (!creation) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "Creation not found" });
    }

    const currentLikes = creation.likes || [];
    const userIdStr = userId.toString();

    let updatedLikes;
    let message;
    if (currentLikes.includes(userIdStr)) {
      updatedLikes = currentLikes.filter((user) => user !== userIdStr);
      message = "Like Removed";
    } else {
      updatedLikes = [...currentLikes, userIdStr];
      message = "Creation Liked";
    }

    // Update directly with array
    await sql`
      UPDATE creations 
      SET likes = ${updatedLikes}::text[] 
      WHERE id = ${id}
    `;

    return res.status(StatusCodes.OK).json({ success: true, message });
  } catch (error) {
    console.log(
      chalk.bgRed("Error in userController.js in toggleLikeCreation function"),
      error,
    );
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "Internal Server Error" });
  }
};
