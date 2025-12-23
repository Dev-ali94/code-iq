import cors from "cors";
import express from "express";
import { serve } from "inngest/express";
import { clerkMiddleware } from "@clerk/express";
import { inngest, functions } from "./lib/inngest.js";
import sessionRoutes from "./routes/sessionRoute.js";
import chatRoutes from "./routes/chatRoutes.js";
import { ENV } from "./lib/env.js";

const app = express();

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


export default app
