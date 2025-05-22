import { Router } from "express";
import { ClientController } from "../controllers/client.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();
const clientController = new ClientController();

// Apply auth middleware to all routes
router.use(authMiddleware);

// GET /api/clients - Get all clients
router.get("/", clientController.getAll);

// GET /api/clients/:id - Get client by ID
router.get("/:id", clientController.getById);

// POST /api/clients - Create a new client
router.post("/", clientController.create);

// PUT /api/clients/:id - Update an existing client
router.put("/:id", clientController.update);

// DELETE /api/clients/:id - Delete a client
router.delete("/:id", clientController.delete);

// GET /api/clients/:id/beneficiaries - Get client beneficiaries
router.get("/:id/beneficiaries", clientController.getBeneficiaries);

export default router;