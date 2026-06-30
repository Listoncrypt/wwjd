import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import "./env.js";
import { askRouter } from "./routes/ask.js";
import { versesRouter } from "./routes/verses.js";
import { logger } from "hono/logger";

const app = new Hono();

// CORS middleware - validates origin against allowlist
const allowed = [
  /^http:\/\/localhost(:\d+)?$/,
  /^http:\/\/127\.0\.0\.1(:\d+)?$/,
  /^https:\/\/[a-z0-9-]+\.dev\.vibecode\.run$/,
  /^https:\/\/[a-z0-9-]+\.vibecode\.run$/,
  /^https:\/\/[a-z0-9-]+\.vibecodeapp\.com$/,
  /^https:\/\/[a-z0-9-]+\.vibecode\.dev$/,
  /^https:\/\/vibecode\.dev$/,
];

app.use(
  "*",
  cors({
    origin: (origin) => (origin && allowed.some((re) => re.test(origin)) ? origin : null),
    credentials: true,
  })
);

// Logging
app.use("*", logger());

// Health check endpoint
app.get("/health", (c) => c.json({ status: "ok" }));

// Routes
app.route("/api/ask", askRouter);
app.route("/api/verses", versesRouter);

const port = Number(process.env.PORT) || 3000;

console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});

