import app from "./app";
import { config } from "./config/env";
import { testConnection } from "./config/db";

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();

    // Start Express server
    app.listen(config.PORT, () => {
      console.log(
        `✅ Server running on port ${config.PORT} in ${config.NODE_ENV} mode`
      );
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
