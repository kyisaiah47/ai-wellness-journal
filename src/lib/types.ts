// Shared types used by both server (Claude) and client (UI) code.

export interface WellnessEntry {
	id: string;
	user_id: string;
	date: string;
	symptoms: string[];
	severity: number; // 1 (mild) – 8 (very severe)
	notes: string;
	ai_summary?: string;
	created_at: string;
	updated_at: string;
}

export interface SymptomAnalysis {
	summary: string;
	urgency: "low" | "medium" | "high";
	patterns: string[];
	recommendations: string[];
	doctorNotes: string;
}
