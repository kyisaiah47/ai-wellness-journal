import { format, subDays } from "date-fns";
import type { WellnessEntry } from "@/lib/types";

// Demo entries shown to signed-out visitors so the journal opens looking
// alive instead of empty. Deterministic shape, dates relative to today.
const SHAPE: Array<{
	daysAgo: number;
	symptoms: string[];
	severity: number;
	notes: string;
}> = [
	{ daysAgo: 0, symptoms: ["Headache"], severity: 3, notes: "Dull, started after lunch." },
	{ daysAgo: 1, symptoms: ["Fatigue", "Headache"], severity: 5, notes: "Slept badly. Rough afternoon." },
	{ daysAgo: 2, symptoms: ["Fatigue"], severity: 4, notes: "Slow morning, fine by evening." },
	{ daysAgo: 4, symptoms: [], severity: 1, notes: "Good day." },
	{ daysAgo: 5, symptoms: ["Nausea"], severity: 3, notes: "Mild, after coffee on empty stomach." },
	{ daysAgo: 6, symptoms: ["Headache", "Light sensitivity"], severity: 6, notes: "Worst one this month. Left work early." },
	{ daysAgo: 7, symptoms: ["Headache"], severity: 4, notes: "Building since the evening before." },
	{ daysAgo: 9, symptoms: [], severity: 2, notes: "Mostly fine." },
	{ daysAgo: 10, symptoms: ["Fatigue"], severity: 3, notes: "" },
	{ daysAgo: 12, symptoms: ["Joint pain"], severity: 4, notes: "Knees, after the long run." },
	{ daysAgo: 13, symptoms: [], severity: 1, notes: "Great day." },
];

export const SAMPLE_ENTRIES: WellnessEntry[] = SHAPE.map((s, i) => {
	const d = subDays(new Date(), s.daysAgo);
	const iso = d.toISOString();
	return {
		id: `sample-${i}`,
		user_id: "sample",
		date: format(d, "yyyy-MM-dd"),
		symptoms: s.symptoms,
		severity: s.severity,
		notes: s.notes,
		created_at: iso,
		updated_at: iso,
	};
});
