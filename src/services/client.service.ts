import sequelize from "../config/db";
import { Persona, Usuario, ContactoEmergencia } from "../models";
import { ApiError } from "../errors/ApiError";

export class ClientService {
  // Get all clients with pagination and filters
  async findAll(options: {
    page?: number;
    limit?: number;
    search?: string;
    estado?: boolean;
    id_titular?: number;
  }) {
    const { page = 1, limit = 10, search, estado, id_titular } = options;
    const offset = (page - 1) * limit;

    const whereClause: any = {};

    if (estado !== undefined) {
      whereClause.estado = estado;
    }

    if (id_titular !== undefined) {
      whereClause.id_titular = id_titular;
    }

    const { count, rows } = await Persona.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Usuario,
          as: "usuario",
          where: search
            ? {
                [sequelize.Op.or]: [
                  { nombre: { [sequelize.Op.iLike]: `%${search}%` } },
                  { apellido: { [sequelize.Op.iLike]: `%${search}%` } },
                  { correo: { [sequelize.Op.iLike]: `%${search}%` } },
                  { numero_documento: { [sequelize.Op.iLike]: `%${search}%` } },
                ],
              }
            : undefined,
          attributes: { exclude: ["contrasena_hash"] },
        },
        {
          model: ContactoEmergencia,
          as: "contactos_emergencia",
          required: false,
        },
        {
          model: Persona,
          as: "titular",
          required: false,
          include: [
            {
              model: Usuario,
              as: "usuario",
              attributes: ["id", "nombre", "apellido"],
            },
          ],
        },
        {
          model: Persona,
          as: "beneficiarios",
          required: false,
          include: [
            {
              model: Usuario,
              as: "usuario",
              attributes: ["id", "nombre", "apellido"],
            },
          ],
        },
      ],
      limit,
      offset,
      order: [["fecha_registro", "DESC"]],
    });

    return {
      data: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  // Get client by ID
  async findById(id: number) {
    const client = await Persona.findByPk(id, {
      include: [
        {
          model: Usuario,
          as: "usuario",
          attributes: { exclude: ["contrasena_hash"] },
        },
        {
          model: ContactoEmergencia,
          as: "contactos_emergencia",
        },
        {
          model: Persona,
          as: "titular",
          include: [
            {
              model: Usuario,
              as: "usuario",
              attributes: ["id", "nombre", "apellido"],
            },
          ],
        },
        {
          model: Persona,
          as: "beneficiarios",
          include: [
            {
              model: Usuario,
              as: "usuario",
              attributes: ["id", "nombre", "apellido"],
            },
          ],
        },
      ],
    });

    if (!client) {
      throw new ApiError("Cliente no encontrado", 404);
    }

    return client;
  }

  // Create a new client
  async create(data: any) {
    const transaction = await sequelize.transaction();

    try {
      let userId;

      // If user data is provided, create a new user
      if (data.usuario) {
        // Generate user code
        const lastUser = await Usuario.findOne({
          order: [["id", "DESC"]],
          transaction,
        });

        const userCode = lastUser
          ? `U${String(Number(lastUser.codigo.substring(1)) + 1).padStart(
              3,
              "0"
            )}`
          : "U001";

        // Create user
        const user = await Usuario.create(
          {
            codigo: userCode,
            nombre: data.usuario.nombre,
            apellido: data.usuario.apellido,
            correo: data.usuario.correo,
            contrasena_hash: data.usuario.contrasena, // In a real app, hash this password
            telefono: data.usuario.telefono,
            direccion: data.usuario.direccion,
            genero: data.usuario.genero,
            tipo_documento: data.usuario.tipo_documento,
            numero_documento: data.usuario.numero_documento,
            fecha_nacimiento: new Date(data.usuario.fecha_nacimiento),
            id_rol: 2, // Assuming 2 is the client role
          },
          { transaction }
        );

        userId = user.id;
      }

      // Generate client code
      const lastClient = await Persona.findOne({
        order: [["id_persona", "DESC"]],
        transaction,
      });

      const clientCode = lastClient
        ? `P${String(Number(lastClient.codigo.substring(1)) + 1).padStart(
            3,
            "0"
          )}`
        : "P001";

      // Create client
      const client = await Persona.create(
        {
          id_usuario: userId,
          codigo: clientCode,
          id_titular: data.id_titular,
          relacion: data.relacion,
          fecha_registro: new Date(),
          estado: data.estado,
        },
        { transaction }
      );

      // Create emergency contacts if provided
      if (data.contactos_emergencia && data.contactos_emergencia.length > 0) {
        const contactsData = data.contactos_emergencia.map((contact: any) => ({
          ...contact,
          id_persona: client.id_persona,
          fecha_registro: new Date(),
        }));

        await ContactoEmergencia.bulkCreate(contactsData, { transaction });
      }

      await transaction.commit();

      // Return the created client with all relations
      return this.findById(client.id_persona);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Update an existing client
  async update(id: number, data: any) {
    const transaction = await sequelize.transaction();

    try {
      const client = await Persona.findByPk(id, { transaction });

      if (!client) {
        await transaction.rollback();
        throw new ApiError("Cliente no encontrado", 404);
      }

      // Update client data
      await client.update(
        {
          id_titular: data.id_titular,
          relacion: data.relacion,
          estado: data.estado,
          fecha_actualizacion: new Date(),
        },
        { transaction }
      );

      // Update user data if provided
      if (data.usuario && client.id_usuario) {
        const user = await Usuario.findByPk(client.id_usuario, { transaction });

        if (user) {
          await user.update(
            {
              nombre: data.usuario.nombre,
              apellido: data.usuario.apellido,
              correo: data.usuario.correo,
              telefono: data.usuario.telefono,
              direccion: data.usuario.direccion,
              genero: data.usuario.genero,
              tipo_documento: data.usuario.tipo_documento,
              numero_documento: data.usuario.numero_documento,
              fecha_nacimiento: data.usuario.fecha_nacimiento
                ? new Date(data.usuario.fecha_nacimiento)
                : undefined,
              fecha_actualizacion: new Date(),
            },
            { transaction }
          );
        }
      }

      // Update emergency contacts if provided
      if (data.contactos_emergencia && data.contactos_emergencia.length > 0) {
        // Delete existing contacts
        await ContactoEmergencia.destroy({
          where: { id_persona: id },
          transaction,
        });

        // Create new contacts
        const contactsData = data.contactos_emergencia.map((contact: any) => ({
          ...contact,
          id_persona: id,
          fecha_registro: new Date(),
          fecha_actualizacion: new Date(),
        }));

        await ContactoEmergencia.bulkCreate(contactsData, { transaction });
      }

      await transaction.commit();

      // Return the updated client with all relations
      return this.findById(id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Delete a client
  async delete(id: number) {
    const transaction = await sequelize.transaction();

    try {
      const client = await Persona.findByPk(id, { transaction });

      if (!client) {
        await transaction.rollback();
        throw new ApiError("Cliente no encontrado", 404);
      }

      // Soft delete - just update estado to false
      await client.update({ estado: false }, { transaction });

      await transaction.commit();
      return { success: true, message: "Cliente eliminado correctamente" };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Get client beneficiaries
  async getBeneficiaries(id: number) {
    const beneficiaries = await Persona.findAll({
      where: { id_titular: id, estado: true },
      include: [
        {
          model: Usuario,
          as: "usuario",
          attributes: { exclude: ["contrasena_hash"] },
        },
      ],
    });

    return beneficiaries;
  }
}
