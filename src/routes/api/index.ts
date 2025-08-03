import Router from "express";

import resultRouter from "./result";

const router = Router();

router.use("/result", resultRouter);

export default router;