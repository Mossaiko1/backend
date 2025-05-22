import { Router } from "express";
import { ContractController } from "../controllers/contract.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();
const contractController = new ContractController();

// Apply auth middleware to all routes
router.use(authMiddleware);

// GET /api/contracts - Get all contracts
router.get("/", contractController.getAll);

// GET /api/contracts/:id - Get contract by ID
router.get("/:id", contractController.getById);

// POST /api/contracts - Create a new contract
router.post("/", contractController.create);

// PUT /api/contracts/:id - Update an existing contract
router.put("/:id", contractController.update);

// DELETE /api/contracts/:id - Delete a contract
router.delete("/:id", contractController.delete);

// POST /api/contracts/renew - Renew a contract
router.post("/renew", contractController.renew);

// POST /api/contracts/freeze - Freeze a contract
router.post("/freeze", contractController.freeze);

// GET /api/contracts/:id/history - Get contract history
router.get("/:id/history", contractController.getHistory);

export default router;
