import type { WellnessEntry } from "@/lib/types";

// ---------------------------------------------------------------------------
// Daily wellness score (0–100), Whoop-recovery style:
// derived from logged severity and symptom load for a day.
// 100 = feeling great / nothing logged severe, low = rough day.
// ---------------------------------------------------------------------------

export type ScoreBand = "good" | "neutral" | "bad";

export function scoreForDay(severity: number, symptomCount: number): number {
	const raw = 104 - severity * 9 - Math.min(symptomCount, 6) * 2;
	return Math.max(0, Math.min(100, Math.round(raw)));
}

export function bandForScore(score: number): ScoreBand {
	if (score >= 67) return "good";
	if (score >= 34) return "neutral";
	return "bad";
}

export const BAND_COLOR: Record<ScoreBand, string> = {
	good: "#2dd4bf", // teal
	neutral: "#facc15", // restrained yellow
	bad: "#f87171", // red
};

export const BAND_LABEL: Record<ScoreBand, string> = {
	good: "Feeling good",
	neutral: "Take it easy",
	bad: "Rough day",
};

export interface DayPoint {
	date: string; // yyyy-MM-dd
	score: number;
	severity: number;
	symptomCount: number;
}

/** Collapse entries into one point per day (averaged severity, union of symptoms). */
export function dailyPoints(entries: WellnessEntry[]): DayPoint[] {
	const byDay = new Map<string, { severities: number[]; symptoms: Set<string> }>();
	for (const e of entries) {
		const day = e.date.slice(0, 10);
		const bucket = byDay.get(day) ?? { severities: [], symptoms: new Set() };
		bucket.severities.push(e.severity);
		e.symptoms.forEach((s) => bucket.symptoms.add(s));
		byDay.set(day, bucket);
	}
	return Array.from(byDay.entries())
		.map(([date, { severities, symptoms }]) => {
			const severity =
				severities.reduce((a, b) => a + b, 0) / severities.length;
			return {
				date,
				severity: Math.round(severity * 10) / 10,
				symptomCount: symptoms.size,
				score: scoreForDay(severity, symptoms.size),
			};
		})
		.sort((a, b) => a.date.localeCompare(b.date));
}

export function latestPoint(points: DayPoint[]): DayPoint | null {
	return points.length > 0 ? points[points.length - 1] : null;
}

/** Average of an array, null when empty. */
export function avg(values: number[]): number | null {
	if (values.length === 0) return null;
	return values.reduce((a, b) => a + b, 0) / values.length;
}

/** Points within the last `days` days ending at the most recent point. */
export function lastNDays(points: DayPoint[], days: number): DayPoint[] {
	if (points.length === 0) return [];
	const end = new Date(points[points.length - 1].date + "T00:00:00");
	const start = new Date(end);
	start.setDate(start.getDate() - (days - 1));
	return points.filter((p) => new Date(p.date + "T00:00:00") >= start);
}
