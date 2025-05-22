import { DataTypes, Model, type Optional } from "sequelize"
import sequelize from "../config/db"
import Contrato from "./Contrato"
import Usuario from "./Usuario"

interface HistorialContratoAttributes {
  id: number
  id_contrato: number
  estado_anterior?: string
  estado_nuevo: string
  fecha_cambio: Date
  usuario_cambio?: number
  motivo?: string
}

interface HistorialContratoCreationAttributes extends Optional<HistorialContratoAttributes, "id" | "fecha_cambio"> {}

class HistorialContrato
  extends Model<HistorialContratoAttributes, HistorialContratoCreationAttributes>
  implements HistorialContratoAttributes
{
  public id!: number
  public id_contrato!: number
  public estado_anterior?: string
  public estado_nuevo!: string
  public fecha_cambio!: Date
  public usuario_cambio?: number
  public motivo?: string

  // Timestamps
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

HistorialContrato.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_contrato: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "contratos",
        key: "id",
      },
    },
    estado_anterior: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    estado_nuevo: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    fecha_cambio: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    usuario_cambio: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "usuarios",
        key: "id",
      },
    },
    motivo: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "HistorialContrato",
    tableName: "historial_contratos",
    timestamps: true,
    underscored: true,
  },
)

// Associations
HistorialContrato.belongsTo(Contrato, { foreignKey: "id_contrato", as: "contrato" })
HistorialContrato.belongsTo(Usuario, { foreignKey: "usuario_cambio", as: "usuario" })

Contrato.hasMany(HistorialContrato, { foreignKey: "id_contrato", as: "historial" })

export default HistorialContrato
