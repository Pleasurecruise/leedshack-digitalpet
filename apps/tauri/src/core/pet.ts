import { getApiBaseUrl } from "@/utils/api";

export type PetMessageReason = "idle" | "focus" | "speed";

export type PetMetrics = {
	idleSeconds?: number;
	typingSpeedKpm?: number;
	focusSeconds?: number;
};

export type PetMessagePayload = {
	reason: PetMessageReason;
	language: "zh" | "en";
	metrics?: PetMetrics;
};

type PetMessageResponse = {
	text: string;
};

export type PetChatPayload = {
	message: string;
	language: "zh" | "en";
};

type PetChatResponse = {
	text: string;
};

export async function fetchPetMessage(payload: PetMessagePayload) {
	const response = await fetch(`${getApiBaseUrl()}/pet`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});

	if (!response.ok) {
		const errorText = await response.text().catch(() => "");
		throw new Error(errorText || "Failed to fetch pet message");
	}

	const data = (await response.json()) as PetMessageResponse;

	return data.text;
}

export async function fetchPetChat(payload: PetChatPayload) {
	const response = await fetch(`${getApiBaseUrl()}/pet/chat`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});

	if (!response.ok) {
		const errorText = await response.text().catch(() => "");
		throw new Error(errorText || "Failed to fetch pet chat response");
	}

	const data = (await response.json()) as PetChatResponse;

	return data.text;
}
