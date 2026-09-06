import { Router } from "express";
import { checkJwt } from "../middleware/authMiddleware.js";
import { getAllWeather, getCities } from "../controllers/weatherController.js";

const router = Router();

router.get("/", checkJwt, getAllWeather);
router.get("/cities", checkJwt, getCities);

export default router;
