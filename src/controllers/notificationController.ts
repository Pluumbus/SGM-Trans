import { Request, Response, NextFunction } from "express";
import getSupabaseServer from "../utils/supabase";
import { NotificationDTOType } from "../types";
/**
 * @swagger
 * /sendNow:
 *   post:
 *     summary: Send a notification immediately
 *     tags: [Notifications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - users
 *               - message
 *               - type
 *             properties:
 *               users:
 *                 type: array
 *                 items:
 *                   type: string
 *               message:
 *                 type: string
 *               type:
 *                 type: string
 *     responses:
 *       200:
 *         description: Notifications sent successfully
 *       400:
 *         description: Missing required fields
 */
export const sendNow = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { users, message, type } = req.body;

    if (!users || !message || !type) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const supabase = await getSupabaseServer();
    const notification: NotificationDTOType = { users, message, type };

    await supabase.from("notifications").insert(notification);

    res.status(200).json({ message: "Notifications sent successfully" });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /scheduleNotification:
 *   post:
 *     summary: Schedule a notification
 *     tags: [Notifications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - users
 *               - message
 *               - type
 *               - delay
 *             properties:
 *               users:
 *                 type: array
 *                 items:
 *                   type: string
 *               message:
 *                 type: string
 *               type:
 *                 type: string
 *               delay:
 *                 type: integer
 *                 description: Delay in milliseconds before sending
 *               recurring:
 *                 type: boolean
 *               interval:
 *                 type: integer
 *                 description: Interval in milliseconds for recurring notifications
 *     responses:
 *       200:
 *         description: Notification scheduled successfully
 *       400:
 *         description: Missing required fields
 */
export const scheduleNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { users, message, type, delay, recurring, interval } = req.body;

    if (
      !users ||
      !message ||
      !Array.isArray(users) ||
      !delay ||
      (recurring && !interval)
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const delayAt = new Date(Date.now() + delay).toISOString();
    const supabase = await getSupabaseServer();
    const notification: NotificationDTOType = { users, message, type };

    await supabase.from("notifications_queue").insert({
      ...notification,
      delay_at: delayAt,
      recurring: recurring || false,
      interval: interval || null,
    });

    setTimeout(async () => {
      await supabase.from("notifications").insert(notification);
    }, delay);

    res.status(200).json({
      message: "Notification scheduled successfully",
      scheduledAt: delayAt,
    });
  } catch (error) {
    next(error);
  }
};
