import { Application, Router } from "express";
import {
  sendNow,
  scheduleNotification,
} from "../controllers/notificationController";

const router = Router();

router.post("/send-now", sendNow as Application);
router.post("/schedule", scheduleNotification as Application);

export default router;
