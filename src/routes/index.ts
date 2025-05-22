import { Router } from "express";
import clientRoutes from "./client.routes";
import contractRoutes from "./contract.routes";
import scheduleRoutes from "./schedule.routes";

const router = Router();

// API routes
router.use("/clients", clientRoutes);
router.use("/contracts", contractRoutes);
router.use("/schedule", scheduleRoutes);

export default router;
