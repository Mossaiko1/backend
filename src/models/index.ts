import Usuario from "./Usuario"
import Persona from "./Persona"
import ContactoEmergencia from "./ContactoEmergencia"
import Membresia from "./Membresia"
import Contrato from "./Contrato"
import HistorialContrato from "./HistorialContrato"
import Entrenamiento from "./Entrenamiento"

export { Usuario, Persona, ContactoEmergencia, Membresia, Contrato, HistorialContrato, Entrenamiento }

// Initialize all models and associations
export const initModels = () => {
  // All associations are defined in the model files
  return {
    Usuario,
    Persona,
    ContactoEmergencia,
    Membresia,
    Contrato,
    HistorialContrato,
    Entrenamiento,
  }
}
