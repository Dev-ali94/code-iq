import path from "path";
import cors from "cors";
import express from "express";
import { serve } from "inngest/express";
import { clerkMiddleware } from "@clerk/express";
import { inngest, functions } from "./src/lib/inngest.js";
import sessionRoutes from "./src/routes/sessionRoute.js";
import chatRoutes from "./src/routes/chatRoutes.js";
import { connectDB } from "./src/lib/db.js";
import { ENV } from "./src/lib/env.js";

const app = express();
const __dirname = path.resolve();

// ===== Middleware =====
app.use(express.json());
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
app.use(clerkMiddleware());

// ===== API Routes =====
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/chat", chatRoutes);
app.use("/api/sessions", sessionRoutes);

// ===== Root route for testing server =====
app.get("/", (req, res) => {
  res.send("Server is alive!");
});

// ===== Production frontend handling =====
if (ENV.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../frontend/dist");
  app.use(express.static(frontendPath));

  // Catch all other routes and serve index.html
  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

// ===== Start server =====
const startServer = async () => {
  try {
    await connectDB();
    app.listen(ENV.PORT, () =>
      console.log(`Server is running on port: ${ENV.PORT}`)
    );
  } catch (error) {
    console.error("Error starting the server", error);
  }
};

startServer();
