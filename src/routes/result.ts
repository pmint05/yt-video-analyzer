import { Router } from "express";
import cache from "../db/cache";
import fs from "fs";
import path from "path";
import { JSON_OUTPUT_PATH } from "../constants/const";

const router = Router();

router.get("/:id", (req, res) => {
  const { id } = req.params;
  if (cache.has(id)) {
    const job = cache.get(id);
    res.render('result', {
      title: 'Analysis Result',
      job,
    });
  } else if (fs.existsSync(path.resolve(JSON_OUTPUT_PATH, `${id}.json`))) {
    const jsonData = fs.readFileSync(path.resolve(JSON_OUTPUT_PATH, `${id}.json`), "utf-8");
    res.render('result', {
      title: 'Analysis Result',
      job: {
        status: "completed",
        ...jsonData ? JSON.parse(jsonData) : {},
      },
    });
    // return res.status(200).json({
    //   success: true,
    //   job: {
    //     status: "completed",
    //     ...jsonData ? JSON.parse(jsonData) : {},
    //   },
    // });
  } else {
    res.render('error', {
      title: 'Error',
      message: 'Job not found',
    });
    // return res.status(404).json({
    //   success: false,
    //   message: "Job not found",
    // });
  }
});

export default router;
