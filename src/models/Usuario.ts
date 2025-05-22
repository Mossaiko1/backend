import { DataTypes, Model, type Optional } from "sequelize";
import sequelize from "../config/db";

interface UsuarioAttributes {
  id: number;
  codigo: string;
  nombre: string;
  apellido: string;
  correo: string;
  contrasena_hash: string;
  telefono?: string;
  direccion?: string;
  genero?: "M" | "F" | "O";
  tipo_documento?: string;
  numero_documento: string;
  fecha_actualizacion: Date;
  asistencias_totales: number;
  fecha_nacimiento: Date;
  estado: boolean;
  id_rol?: number;
}

interface UsuarioCreationAttributes
  extends Optional<
    UsuarioAttributes,
    "id" | "fecha_actualizacion" | "asistencias_totales" | "estado"
  > {}

class Usuario
  extends Model<UsuarioAttributes, UsuarioCreationAttributes>
  implements UsuarioAttributes
{
  public id!: number;
  public codigo!: string;
  public nombre!: string;
  public apellido!: string;
  public correo!: string;
  public contrasena_hash!: string;
  public telefono?: string;
  public direccion?: string;
  public genero?: "M" | "F" | "O";
  public tipo_documento?: string;
  public numero_documento!: string;
  public fecha_actualizacion!: Date;
  public asistencias_totales!: number;
  public fecha_nacimiento!: Date;
  public estado!: boolean;
  public id_rol?: number;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Usuario.init(
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
        is: /^U\d{3}$/,
      },
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: [3, 100],
      },
    },
    apellido: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: [3, 100],
      },
    },
    correo: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    contrasena_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    telefono: {
      type: DataTypes.STRING(15),
      allowNull: true,
      validate: {
        is: /^\d{7,15}$/,
      },
    },
    direccion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    genero: {
      type: DataTypes.CHAR(1),
      allowNull: true,
      validate: {
        isIn: [["M", "F", "O"]],
      },
    },
    tipo_documento: {
      type: DataTypes.STRING(10),
      allowNull: true,
      validate: {
        isIn: [["CC", "CE", "TI", "PP", "DIE"]],
      },
    },
    numero_documento: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    fecha_actualizacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    asistencias_totales: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    fecha_nacimiento: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    id_rol: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "roles",
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "Usuario",
    tableName: "usuarios",
    timestamps: true,
    underscored: true,
  }
);

export default Usuario;
