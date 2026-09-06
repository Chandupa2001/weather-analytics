import { Router } from "express";
import { checkJwt } from "../middleware/authMiddleware.js";
import { getStatus } from "../controllers/cacheController.js";

const router = Router();

router.get("/", checkJwt, getStatus);

export default router;
