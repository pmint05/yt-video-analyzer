import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { IMAGE_OUTPUT_PATH } from "../../constants/const";

export async function getThumbnail(req: Request, res: Response) {
  const { fileName } = req.params;
  const thumbnailPath = path.resolve(IMAGE_OUTPUT_PATH, fileName);

  if (fs.existsSync(thumbnailPath)) {
    return res.status(200).sendFile(thumbnailPath);
  } else {
    return res.status(404).json({
      success: false,
      message: "Thumbnail not found",
    });
  }
}
