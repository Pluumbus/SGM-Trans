import { Application, Router } from "express";
import {
  sendNow,
  scheduleNotification,
} from "../controllers/notificationController";

const router = Router();

router.post("/sendNow", sendNow as Application);
router.post("/scheduleNotification", scheduleNotification as Application);

export default router;
