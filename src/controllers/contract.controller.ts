import type { Request, Response, NextFunction } from "express";
import { ContractService } from "../services/contract.service";
import {
  createContractSchema,
  updateContractSchema,
  contractQuerySchema,
  contractIdSchema,
  renewContractSchema,
  freezeContractSchema,
} from "../validators/contract.validator";
import { ApiResponse } from "../utils/apiResponse";

const contractService = new ContractService();

export class ContractController {
  // Get all contracts
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const query = contractQuerySchema.parse(req.query);
      const result = await contractService.findAll(query);

      return ApiResponse.success(
        res,
        result.data,
        "Contratos obtenidos correctamente",
        result.pagination
      );
    } catch (error) {
      next(error);
    }
  }

  // Get contract by ID
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = contractIdSchema.parse(req.params);
      const contract = await contractService.findById(id);

      return ApiResponse.success(
        res,
        contract,
        "Contrato obtenido correctamente"
      );
    } catch (error) {
      next(error);
    }
  }

  // Create a new contract
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createContractSchema.parse(req.body);
      const contract = await contractService.create(data);

      return ApiResponse.success(
        res,
        contract,
        "Contrato creado correctamente",
        undefined,
        201
      );
    } catch (error) {
      next(error);
    }
  }

  // Update an existing contract
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = contractIdSchema.parse(req.params);
      const data = updateContractSchema.parse(req.body);
      const contract = await contractService.update(id, data);

      return ApiResponse.success(
        res,
        contract,
        "Contrato actualizado correctamente"
      );
    } catch (error) {
      next(error);
    }
  }

  // Delete a contract
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = contractIdSchema.parse(req.params);
      // Assuming user ID is available in req.user.id from auth middleware
      const userId = (req as any).user?.id;

      const result = await contractService.delete(id, userId);

      return ApiResponse.success(
        res,
        result,
        "Contrato cancelado correctamente"
      );
    } catch (error) {
      next(error);
    }
  }

  // Renew a contract
  async renew(req: Request, res: Response, next: NextFunction) {
    try {
      const data = renewContractSchema.parse(req.body);
      const contract = await contractService.renew(data);

      return ApiResponse.success(
        res,
        contract,
        "Contrato renovado correctamente"
      );
    } catch (error) {
      next(error);
    }
  }

  // Freeze a contract
  async freeze(req: Request, res: Response, next: NextFunction) {
    try {
      const data = freezeContractSchema.parse(req.body);
      const contract = await contractService.freeze(data);

      return ApiResponse.success(
        res,
        contract,
        "Contrato congelado correctamente"
      );
    } catch (error) {
      next(error);
    }
  }

  // Get contract history
  async getHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = contractIdSchema.parse(req.params);
      const history = await contractService.getHistory(id);

      return ApiResponse.success(
        res,
        history,
        "Historial de contrato obtenido correctamente"
      );
    } catch (error) {
      next(error);
    }
  }
}
