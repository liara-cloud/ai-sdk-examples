import type { SlackEvent } from "@slack/web-api";
import {
  assistantThreadMessage,
  handleNewAssistantMessage,
} from "../lib/handle-messages";
import { handleNewAppMention } from "../lib/handle-app-mention";
import { verifyRequest, getBotId } from "../lib/slack-utils";
import type { Request, Response } from "express";

// Express handler for POST /api/events
export async function eventsHandler(req: Request, res: Response) {
  // Express provides parsed body if express.json() middleware is used
  const rawBody = JSON.stringify(req.body);
  const payload = req.body;
  const requestType = payload.type as "url_verification" | "event_callback";

  // See https://api.slack.com/events/url_verification
  if (requestType === "url_verification") {
    return res.status(200).send(payload.challenge);
  }

  // For Slack signature verification, we need the raw body and headers
  // The verifyRequest function may need to be updated to work with Express
  const valid = await verifyRequest({
    requestType,
    request: req,
    rawBody,
  });
  if (!valid) {
    return res.status(400).send("Invalid request");
  }

  try {
    const botUserId = await getBotId();

    const event = payload.event as SlackEvent;

    if (event.type === "app_mention") {
      void handleNewAppMention(event, botUserId);
    }

    if (event.type === "assistant_thread_started") {
      void assistantThreadMessage(event);
    }

    if (
      event.type === "message" &&
      !event.subtype &&
      event.channel_type === "im" &&
      !event.bot_id &&
      !event.bot_profile &&
      event.bot_id !== botUserId
    ) {
      void handleNewAssistantMessage(event, botUserId);
    }

    return res.status(200).send("Success!");
  } catch (error) {
    console.error("Error generating response", error);
    return res.status(500).send("Error generating response");
  }
}
