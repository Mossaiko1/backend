import type { Request, Response, NextFunction } from "express";
import { ClientService } from "../services/client.service";
import {
  createClientSchema,
  updateClientSchema,
  clientQuerySchema,
  clientIdSchema,
} from "../validators/client.validator";
import { ApiResponse } from "../utils/apiResponse";

const clientService = new ClientService();

export class ClientController {
  // Get all clients
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const query = clientQuerySchema.parse(req.query);
      const result = await clientService.findAll(query);

      return ApiResponse.success(
        res,
        result.data,
        "Clientes obtenidos correctamente",
        result.pagination
      );
    } catch (error) {
      next(error);
    }
  }

  // Get client by ID
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = clientIdSchema.parse(req.params);
      const client = await clientService.findById(id);

      return ApiResponse.success(res, client, "Cliente obtenido correctamente");
    } catch (error) {
      next(error);
    }
  }

  // Create a new client
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createClientSchema.parse(req.body);
      const client = await clientService.create(data);

      return ApiResponse.success(
        res,
        client,
        "Cliente creado correctamente",
        undefined,
        201
      );
    } catch (error) {
      next(error);
    }
  }

  // Update an existing client
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = clientIdSchema.parse(req.params);
      const data = updateClientSchema.parse(req.body);
      const client = await clientService.update(id, data);

      return ApiResponse.success(
        res,
        client,
        "Cliente actualizado correctamente"
      );
    } catch (error) {
      next(error);
    }
  }

  // Delete a client
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = clientIdSchema.parse(req.params);
      const result = await clientService.delete(id);

      return ApiResponse.success(
        res,
        result,
        "Cliente eliminado correctamente"
      );
    } catch (error) {
      next(error);
    }
  }

  // Get client beneficiaries
  async getBeneficiaries(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = clientIdSchema.parse(req.params);
      const beneficiaries = await clientService.getBeneficiaries(id);

      return ApiResponse.success(
        res,
        beneficiaries,
        "Beneficiarios obtenidos correctamente"
      );
    } catch (error) {
      next(error);
    }
  }
}
