import { Router } from "express";
import cache from "../../db/cache";
import fs from "fs";
import path from "path";
import { JSON_OUTPUT_PATH } from "../../constants/const";

const router = Router();

router.get("/:id", (req, res) => {
  const { id } = req.params;
  if (cache.has(id)) {
    const job = cache.get(id);
    return res.status(200).json({
      success: true,
      job,
      jobId: id,
    });
  } else if (fs.existsSync(path.resolve(JSON_OUTPUT_PATH, `${id}.json`))) {
    const jsonData = fs.readFileSync(path.resolve(JSON_OUTPUT_PATH, `${id}.json`), "utf-8");
    return res.status(200).json({
      success: true,
      job: {
        status: "completed",
        ...jsonData ? JSON.parse(jsonData) : {},
        jobId: id,
      },
    });
  } else {
    return res.status(404).json({
      success: false,
      message: "Job not found",
    });
  }
});

export default router;
