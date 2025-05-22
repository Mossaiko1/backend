import { Sequelize } from "sequelize"
import { config } from "./env"

// Create Sequelize instance
const sequelize = new Sequelize({
  dialect: "postgres",
  host: config.DB_HOST,
  port: config.DB_PORT,
  database: config.DB_NAME,
  username: config.DB_USER,
  password: config.DB_PASSWORD,
  logging: config.NODE_ENV === "development" ? console.log : false,
  define: {
    timestamps: true,
    underscored: true,
  },
})

// Test database connection
export const testConnection = async (): Promise<void> => {
  try {
    await sequelize.authenticate()
    console.log("✅ Database connection established successfully.")
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error)
    throw error
  }
}

export default sequelize
