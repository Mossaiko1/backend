import { createServer } from "./config/server";
import passport from "./config/passport";
import { initModels } from "./models";

// Initialize Express app
const app = createServer();

// Initialize Passport
app.use(passport.initialize());

// Initialize models and associations
initModels();

export default app;
