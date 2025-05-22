import { DataTypes, Model, type Optional } from "sequelize";
import sequelize from "../config/db";
import Persona from "./Persona";

interface ContactoEmergenciaAttributes {
  id: number;
  id_persona: number;
  nombre_contacto: string;
  telefono_contacto: string;
  relacion_contacto?: string;
  es_mismo_beneficiario: boolean;
  fecha_registro: Date;
  fecha_actualizacion: Date;
}

interface ContactoEmergenciaCreationAttributes
  extends Optional<
    ContactoEmergenciaAttributes,
    "id" | "es_mismo_beneficiario" | "fecha_actualizacion"
  > {}

class ContactoEmergencia
  extends Model<
    ContactoEmergenciaAttributes,
    ContactoEmergenciaCreationAttributes
  >
  implements ContactoEmergenciaAttributes
{
  public id!: number;
  public id_persona!: number;
  public nombre_contacto!: string;
  public telefono_contacto!: string;
  public relacion_contacto?: string;
  public es_mismo_beneficiario!: boolean;
  public fecha_registro!: Date;
  public fecha_actualizacion!: Date;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ContactoEmergencia.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_persona: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "personas",
        key: "id_persona",
      },
    },
    nombre_contacto: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    telefono_contacto: {
      type: DataTypes.STRING(15),
      allowNull: false,
      validate: {
        is: /^\d{7,15}$/,
      },
    },
    relacion_contacto: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    es_mismo_beneficiario: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
  },
  {
    sequelize,
    modelName: "ContactoEmergencia",
    tableName: "contactos_emergencia",
    timestamps: true,
    underscored: true,
  }
);

// Associations
ContactoEmergencia.belongsTo(Persona, {
  foreignKey: "id_persona",
  as: "persona",
});
Persona.hasMany(ContactoEmergencia, {
  foreignKey: "id_persona",
  as: "contactos_emergencia",
});

export default ContactoEmergencia;
