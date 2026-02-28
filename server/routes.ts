import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  app.get(api.schemes.list.path, async (req, res) => {
    try {
      const schemes = await storage.getSchemes();
      res.json(schemes);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch schemes" });
    }
  });

  app.post(api.match.create.path, async (req, res) => {
    try {
      const input = api.match.create.input.parse(req.body);
      const matched = await storage.matchSchemes(input);
      res.json(matched);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app.get("/api/test-ai", async (req, res) => {
    try {
      const OpenAI = (await import("openai")).default;

      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "user", content: "Explain PM Kisan Yojana simply." },
        ],
      });

      res.json({
        result: response.choices[0].message.content,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "AI failed" });
    }
  });
  return httpServer;
}
