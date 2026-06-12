import Anthropic from "@anthropic-ai/sdk";
import type { SymptomAnalysis, WellnessEntry } from "@/lib/types";

// Server-side only. ANTHROPIC_API_KEY is never exposed to the browser —
// this module must only be imported from API routes / server code.
const anthropic = new Anthropic({
	apiKey: process.env.ANTHROPIC_API_KEY,
});

const MODEL = "claude-sonnet-4-6";

function entriesForPrompt(entries: WellnessEntry[]) {
	// Strip ids and metadata; the model only needs the health-relevant fields.
	return entries.map((e) => ({
		date: e.date,
		symptoms: e.symptoms,
		severity: e.severity,
		notes: e.notes,
	}));
}

function extractText(message: Anthropic.Message): string {
	return message.content
		.filter((block) => block.type === "text")
		.map((block) => block.text)
		.join("\n");
}

export async function analyzeSymptoms(
	entries: WellnessEntry[]
): Promise<SymptomAnalysis> {
	const message = await anthropic.messages.create({
		model: MODEL,
		max_tokens: 1500,
		system:
			"You are a careful health-tracking assistant. You summarize self-reported symptom logs for laypeople and their doctors. You never diagnose. You always note that your output is informational and not medical advice. Respond ONLY with a single JSON object, no markdown fences.",
		messages: [
			{
				role: "user",
				content: `Analyze the following self-reported symptom entries and respond with JSON using exactly these keys:
- "summary": 2-4 sentence plain-language summary of the period
- "urgency": one of "low" | "medium" | "high" — how soon a doctor visit seems warranted
- "patterns": array of short strings, notable patterns or correlations
- "recommendations": array of short strings, general (non-prescriptive) self-care suggestions
- "doctorNotes": a concise paragraph written for a physician (onset, frequency, severity trend, triggers)

Symptom entries:
${JSON.stringify(entriesForPrompt(entries), null, 2)}`,
			},
		],
	});

	const text = extractText(message);
	const jsonMatch = text.match(/\{[\s\S]*\}/);
	if (jsonMatch) {
		const parsed = JSON.parse(jsonMatch[0]) as Partial<SymptomAnalysis>;
		return {
			summary: parsed.summary ?? text,
			urgency:
				parsed.urgency === "high" || parsed.urgency === "medium"
					? parsed.urgency
					: "low",
			patterns: Array.isArray(parsed.patterns) ? parsed.patterns : [],
			recommendations: Array.isArray(parsed.recommendations)
				? parsed.recommendations
				: [],
			doctorNotes: parsed.doctorNotes ?? "",
		};
	}

	// Fallback if the model didn't return parseable JSON.
	return {
		summary: text,
		urgency: "low",
		patterns: [],
		recommendations: [
			"Consult with a healthcare provider for personalized advice.",
		],
		doctorNotes: text,
	};
}

export async function generateHealthInsights(
	entries: WellnessEntry[]
): Promise<string[]> {
	const message = await anthropic.messages.create({
		model: MODEL,
		max_tokens: 600,
		system:
			"You are a careful health-tracking assistant analyzing self-reported symptom logs. You never diagnose.",
		messages: [
			{
				role: "user",
				content: `Analyze these health entries for patterns and correlations:
${JSON.stringify(entriesForPrompt(entries), null, 2)}

Provide 3-5 brief insights about patterns, trends, or correlations you notice.
One sentence per insight, one insight per line, no numbering or bullets. Focus on actionable observations.`,
			},
		],
	});

	const text = extractText(message);
	return text
		.split("\n")
		.map((line) => line.replace(/^[\s\-•*\d.]+/, "").trim())
		.filter((line) => line.length > 0)
		.slice(0, 5);
}
