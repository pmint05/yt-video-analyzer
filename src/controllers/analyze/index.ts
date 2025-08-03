import fs from "fs";
import path from "path";
import type { Request, Response } from "express";
import { randomUUID } from "node:crypto";

import { JSON_OUTPUT_PATH, YOUTUBE_URL_REGEX } from "../../constants/const";
import piscina from "../../services/piscina";
import { JobStore } from "../../stores/jobStore";

export default async function analyzeController(req: Request, res: Response) {
  const { url } = req.body;

  if (!YOUTUBE_URL_REGEX.test(url)) {
    return res.status(400).json({
      success: false,
      message: "Invalid YouTube URL",
    });
  }

  const id = randomUUID();

  JobStore.setPending(id, url);

  piscina.run({
    id,
    url,
  }, {
    name: 'analyzeVideo',
  }).then(({ id, url, result, error }) => {
    if (error) {
      JobStore.setFailed(id, url, error);
    } else {
      JobStore.setCompleted(id, url, result);
      const jsonFilePath = path.resolve(JSON_OUTPUT_PATH, `${id}.json`);
      if (!fs.existsSync(path.dirname(jsonFilePath))) {
        fs.mkdirSync(path.dirname(jsonFilePath), { recursive: true });
      }
      fs.writeFileSync(
        jsonFilePath,
        JSON.stringify({
          url,
          result,
        }, null, 2)
      );
    }
  }).catch((error) => {
    JobStore.setFailed(id, url, error);
    console.error("Error in analyzeController:", error);
  });

  return res.status(202).json({
    success: true,
    message: "Job started",
    jobId: id,
  });
}
