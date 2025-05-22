import { DataTypes, Model, type Optional } from "sequelize";
import sequelize from "../config/db";

interface MembresiaAttributes {
  id: number;
  codigo: string;
  nombre: string;
  descripcion?: string;
  dias_acceso: number;
  vigencia_dias: number;
  precio: number;
  fecha_creacion: Date;
  estado: boolean;
}

interface MembresiaCreationAttributes
  extends Optional<MembresiaAttributes, "id" | "descripcion" | "estado"> {}

class Membresia
  extends Model<MembresiaAttributes, MembresiaCreationAttributes>
  implements MembresiaAttributes
{
  public id!: number;
  public codigo!: string;
  public nombre!: string;
  public descripcion?: string;
  public dias_acceso!: number;
  public vigencia_dias!: number;
  public precio!: number;
  public fecha_creacion!: Date;
  public estado!: boolean;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Membresia.init(
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
        is: /^M\d{3}$/,
      },
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    dias_acceso: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    vigencia_dias: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: "Membresia",
    tableName: "membresias",
    timestamps: true,
    underscored: true,
  }
);

export default Membresia;
