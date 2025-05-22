import { DataTypes, Model, type Optional } from "sequelize";
import sequelize from "../config/db";
import Usuario from "./Usuario";

interface PersonaAttributes {
  id_persona: number;
  id_usuario?: number;
  codigo: string;
  id_titular?: number;
  relacion?: string;
  fecha_registro: Date;
  fecha_actualizacion: Date;
  estado: boolean;
}

interface PersonaCreationAttributes
  extends Optional<
    PersonaAttributes,
    "id_persona" | "fecha_actualizacion" | "estado"
  > {}

class Persona
  extends Model<PersonaAttributes, PersonaCreationAttributes>
  implements PersonaAttributes
{
  public id_persona!: number;
  public id_usuario?: number;
  public codigo!: string;
  public id_titular?: number;
  public relacion?: string;
  public fecha_registro!: Date;
  public fecha_actualizacion!: Date;
  public estado!: boolean;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Persona.init(
  {
    id_persona: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "usuarios",
        key: "id",
      },
    },
    codigo: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
      validate: {
        is: /^P\d{3}$/,
      },
    },
    id_titular: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "personas",
        key: "id_persona",
      },
    },
    relacion: {
      type: DataTypes.STRING(50),
      allowNull: true,
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
    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: "Persona",
    tableName: "personas",
    timestamps: true,
    underscored: true,
  }
);

// Associations
Persona.belongsTo(Usuario, { foreignKey: "id_usuario", as: "usuario" });
Persona.belongsTo(Persona, { foreignKey: "id_titular", as: "titular" });
Persona.hasMany(Persona, { foreignKey: "id_titular", as: "beneficiarios" });

export default Persona;
