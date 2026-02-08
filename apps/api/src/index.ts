import "@/load-env";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { trpcServer } from "@hono/trpc-server";
import { isAiConfigured, streamChat } from "@my-monorepo/ai";
import { createLoggerWithContext } from "@my-monorepo/logger";
import { z } from "@my-monorepo/utils";
import { appRouter } from "@/trpc/routers";
import { createTRPCContext } from "@/trpc/init";

const logger = createLoggerWithContext("api");

const app = new Hono();

app.use(
	"*",
	cors({
		origin: [
			"http://localhost:3000", // web
			"http://localhost:1420", // tauri
		],
		allowMethods: ["GET", "POST", "OPTIONS"],
		allowHeaders: ["Content-Type", "trpc-accept", "trpc-batch-mode", "x-trpc-source"],
	}),
);

app.use(
	"/trpc/*",
	trpcServer({
		router: appRouter,
		createContext: createTRPCContext,
	}),
);

const petRequestSchema = z.object({
	reason: z.enum(["idle", "focus", "speed"]).default("idle"),
	language: z.enum(["zh", "en"]).default("zh"),
	metrics: z
		.object({
			idleSeconds: z.number().nonnegative().optional(),
			typingSpeedKpm: z.number().nonnegative().optional(),
			focusSeconds: z.number().nonnegative().optional(),
		})
		.optional(),
});

const petChatRequestSchema = z.object({
	message: z.string().trim().min(1).max(500),
	language: z.enum(["zh", "en"]).default("zh"),
});

app.post("/pet", async (c) => {
	if (!isAiConfigured()) {
		return c.json({ message: "AI not configured" }, 500);
	}

	const payload = petRequestSchema.safeParse(await c.req.json().catch(() => ({})));

	if (!payload.success) {
		return c.json({ message: "Invalid payload" }, 400);
	}

	const { reason, language, metrics } = payload.data;
	const locale = language === "en" ? "English" : "Simplified Chinese";
	const idleSeconds = metrics?.idleSeconds ?? 0;
	const typingSpeedKpm = metrics?.typingSpeedKpm ?? 0;
	const focusSeconds = metrics?.focusSeconds ?? 0;

	const system = [
		"You are a friendly desktop pet that supports learning and productivity.",
		`Reply in ${locale}.`,
		"Keep it playful, warm, and supportive.",
		"Use at most two short sentences.",
		"Do not mention being an AI or model.",
		"If helpful, gently suggest a small next step or a short break.",
	].join(" ");

	const user = [
		`Reason: ${reason}.`,
		`IdleSeconds: ${idleSeconds}.`,
		`TypingSpeedKpm: ${typingSpeedKpm}.`,
		`FocusSeconds: ${focusSeconds}.`,
		"Please mention either typing speed or focus duration if it makes sense.",
	].join(" ");

	const result = streamChat({
		messages: [
			{ role: "system", content: system },
			{ role: "user", content: user },
		],
		maxOutputTokens: 120,
		temperature: 0.7,
	});

	let text = "";

	for await (const chunk of result.textStream) {
		text += chunk;
	}

	return c.json({ text: text.trim() });
});

app.post("/pet/chat", async (c) => {
	if (!isAiConfigured()) {
		return c.json({ message: "AI not configured" }, 500);
	}

	const payload = petChatRequestSchema.safeParse(await c.req.json().catch(() => ({})));

	if (!payload.success) {
		return c.json({ message: "Invalid payload" }, 400);
	}

	const { message, language } = payload.data;
	const locale = language === "en" ? "English" : "Simplified Chinese";

	const system = [
		"You are a friendly desktop pet that supports learning and productivity.",
		`Reply in ${locale}.`,
		"Keep it playful, warm, and supportive.",
		"Use at most two short sentences.",
		"Do not mention being an AI or model.",
		"If asked for medical, legal, or financial advice, suggest seeking professional help.",
	].join(" ");

	const result = streamChat({
		messages: [
			{ role: "system", content: system },
			{ role: "user", content: message },
		],
		maxOutputTokens: 180,
		temperature: 0.7,
	});

	let text = "";

	for await (const chunk of result.textStream) {
		text += chunk;
	}

	return c.json({ text: text.trim() });
});

app.get("/", (c) => {
	return c.json({ message: "tRPC API Server" });
});

const port = Number(process.env.PORT) || 5173;

logger.info(`Server running on http://localhost:${port}`);

export default {
	port,
	fetch: app.fetch,
};
