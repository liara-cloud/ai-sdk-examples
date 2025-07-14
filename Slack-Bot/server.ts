import express from "express";
import { eventsHandler } from "./api/events";

const app = express();
const port = process.env.PORT || 3000;

// Parse JSON bodies for incoming requests
app.use(express.json());

// Slack events endpoint
app.post("/api/events", eventsHandler);

// Health check endpoint (optional)
app.get("/", (_req, res) => {
  res.send("Slack bot server is running.");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});