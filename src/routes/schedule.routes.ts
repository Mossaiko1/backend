import { Router } from "express";
import { ScheduleController } from "../controllers/schedule.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();
const scheduleController = new ScheduleController();

// Apply auth middleware to all routes
router.use(authMiddleware);

// GET /api/schedule - Get all training sessions
router.get("/", scheduleController.getAll);

// GET /api/schedule/:id - Get training session by ID
router.get("/:id", scheduleController.getById);

// POST /api/schedule - Create a new training session
router.post("/", scheduleController.create);

// PUT /api/schedule/:id - Update an existing training session
router.put("/:id", scheduleController.update);

// DELETE /api/schedule/:id - Delete a training session
router.delete("/:id", scheduleController.delete);

// POST /api/schedule/availability - Check availability for a given time period
router.post("/availability", scheduleController.checkAvailability);

// GET /api/schedule/client/:id - Get schedule for a specific client
router.get("/client/:id", scheduleController.getClientSchedule);

// GET /api/schedule/trainer/:id - Get schedule for a specific trainer
router.get("/trainer/:id", scheduleController.getTrainerSchedule);

export default router;
