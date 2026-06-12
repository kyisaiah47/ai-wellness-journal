"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ChevronDown } from "lucide-react";
import type { WellnessEntry } from "@/lib/types";
import { scoreForDay, bandForScore, BAND_COLOR } from "@/lib/score";

interface Props {
	entries: WellnessEntry[];
	onLog: () => void;
}

const severityText = (severity: number) => {
	if (severity <= 2) return "Mild";
	if (severity <= 4) return "Moderate";
	if (severity <= 6) return "Severe";
	return "Very severe";
};

export default function HealthTimeline({ entries, onLog }: Props) {
	const [openId, setOpenId] = useState<string | null>(null);

	if (entries.length === 0) {
		return (
			<div className="px-6 py-16 text-center">
				<p className="text-sm text-faint mb-3">
					Nothing logged yet. Your daily entries will appear here.
				</p>
				<button
					onClick={onLog}
					className="text-sm font-medium text-good hover:underline underline-offset-4"
				>
					Log your first entry →
				</button>
			</div>
		);
	}

	const sorted = [...entries].sort(
		(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
	);

	return (
		<div className="px-6 py-5">
			<h2 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-mist mb-4">
				Timeline
			</h2>
			<ul className="divide-y divide-edge">
				{sorted.map((entry) => {
					const score = scoreForDay(entry.severity, entry.symptoms.length);
					const color = BAND_COLOR[bandForScore(score)];
					const open = openId === entry.id;
					return (
						<li key={entry.id}>
							<button
								onClick={() => setOpenId(open ? null : entry.id)}
								className="w-full py-4 flex items-center gap-4 text-left group"
							>
								<span
									className="h-2.5 w-2.5 rounded-full shrink-0"
									style={{ background: color }}
								/>
								<div className="min-w-0 flex-1">
									<p className="text-sm text-snow">
										{format(new Date(entry.date + "T00:00:00"), "EEE, MMM d")}
										<span className="text-faint"> · </span>
										<span className="text-mist">
											{entry.symptoms.slice(0, 3).join(", ")}
											{entry.symptoms.length > 3 &&
												` +${entry.symptoms.length - 3}`}
										</span>
									</p>
								</div>
								<span className="text-xs tnum text-mist shrink-0">
									{severityText(entry.severity)} · {entry.severity}/8
								</span>
								<span
									className="text-sm tnum font-medium shrink-0 w-8 text-right"
									style={{ color }}
								>
									{score}
								</span>
								<ChevronDown
									className={`h-4 w-4 text-faint shrink-0 transition-transform ${
										open ? "rotate-180" : ""
									}`}
								/>
							</button>
							{open && (
								<div className="pb-5 pl-6 space-y-3">
									<div className="flex flex-wrap gap-1.5">
										{entry.symptoms.map((symptom) => (
											<span
												key={symptom}
												className="px-2.5 py-1 rounded-full bg-panel-2 border border-edge text-xs text-mist"
											>
												{symptom}
											</span>
										))}
									</div>
									{entry.notes && (
										<p className="text-sm text-mist leading-relaxed max-w-2xl">
											{entry.notes}
										</p>
									)}
									<p className="text-[11px] text-faint">
										Recorded {format(new Date(entry.created_at), "PPp")}
									</p>
								</div>
							)}
						</li>
					);
				})}
			</ul>
		</div>
	);
}
