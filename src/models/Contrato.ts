import { DataTypes, Model, type Optional } from "sequelize"
import sequelize from "../config/db"
import Persona from "./Persona"
import Membresia from "./Membresia"
import Usuario from "./Usuario"

interface ContratoAttributes {
  id: number
  codigo: string
  id_persona: number
  id_membresia: number
  fecha_inicio: Date
  fecha_fin: Date
  membresia_precio: number
  estado: "Activo" | "Congelado" | "Vencido" | "Cancelado" | "Por vencer"
  fecha_registro: Date
  fecha_actualizacion: Date
  usuario_registro?: number
  usuario_actualizacion?: number
}

interface ContratoCreationAttributes
  extends Optional<ContratoAttributes, "id" | "fecha_registro" | "fecha_actualizacion"> {}

class Contrato extends Model<ContratoAttributes, ContratoCreationAttributes> implements ContratoAttributes {
  public id!: number
  public codigo!: string
  public id_persona!: number
  public id_membresia!: number
  public fecha_inicio!: Date
  public fecha_fin!: Date
  public membresia_precio!: number
  public estado!: "Activo" | "Congelado" | "Vencido" | "Cancelado" | "Por vencer"
  public fecha_registro!: Date
  public fecha_actualizacion!: Date
  public usuario_registro?: number
  public usuario_actualizacion?: number

  // Timestamps
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

Contrato.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    codigo: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
      validate: {
        is: /^C\d{4}$/,
      },
    },
    id_persona: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "personas",
        key: "id_persona",
      },
    },
    id_membresia: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "membresias",
        key: "id",
      },
    },
    fecha_inicio: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    fecha_fin: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    membresia_precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    estado: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        isIn: [["Activo", "Congelado", "Vencido", "Cancelado", "Por vencer"]],
      },
    },
    fecha_registro: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    fecha_actualizacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    usuario_registro: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "usuarios",
        key: "id",
      },
    },
    usuario_actualizacion: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "usuarios",
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "Contrato",
    tableName: "contratos",
    timestamps: true,
    underscored: true,
  },
)

// Associations
Contrato.belongsTo(Persona, { foreignKey: "id_persona", as: "persona" })
Contrato.belongsTo(Membresia, { foreignKey: "id_membresia", as: "membresia" })
Contrato.belongsTo(Usuario, { foreignKey: "usuario_registro", as: "registrador" })
Contrato.belongsTo(Usuario, { foreignKey: "usuario_actualizacion", as: "actualizador" })

Persona.hasMany(Contrato, { foreignKey: "id_persona", as: "contratos" })
Membresia.hasMany(Contrato, { foreignKey: "id_membresia", as: "contratos" })

export default Contrato
