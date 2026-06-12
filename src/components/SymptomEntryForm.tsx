"use client";

import { useState } from "react";
import { supabase, ENTRIES_TABLE } from "@/lib/supabase";
import { AlertCircle } from "lucide-react";
import { scoreForDay, bandForScore, BAND_COLOR } from "@/lib/score";

interface Props {
	onEntryAdded: () => void;
}

const physicalSymptoms = [
	"Headache",
	"Fatigue",
	"Nausea",
	"Fever",
	"Cough",
	"Sore throat",
	"Muscle pain",
	"Joint pain",
	"Dizziness",
	"Stomach pain",
	"Back pain",
	"Shortness of breath",
	"Skin issues",
	"Vision / hearing problems",
	"Chills / sweating",
	"Appetite changes",
	"Bowel / urinary issues",
];
const mentalSymptoms = [
	"Sleep issues",
	"Anxiety",
	"Low mood",
	"Irritability",
	"Concentration issues",
	"Mood swings",
	"Panic attacks",
];

const severityLabel = (level: number) => {
	if (level <= 2) return "Mild";
	if (level <= 4) return "Moderate";
	if (level <= 6) return "Severe";
	return "Very severe";
};

export default function SymptomEntryForm({ onEntryAdded }: Props) {
	const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
	const [severity, setSeverity] = useState(3);
	const [notes, setNotes] = useState("");
	const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");

	const toggle = (symptom: string) =>
		setSelectedSymptoms((prev) =>
			prev.includes(symptom)
				? prev.filter((s) => s !== symptom)
				: [...prev, symptom]
		);

	const previewScore = scoreForDay(severity, selectedSymptoms.length || 1);
	const previewColor = BAND_COLOR[bandForScore(previewScore)];

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (selectedSymptoms.length === 0) {
			setError("Select at least one symptom.");
			return;
		}

		setIsSubmitting(true);
		setError("");
		try {
			// user_id defaults to auth.uid() in the database; RLS scopes rows per user.
			const { error: submitError } = await supabase
				.from(ENTRIES_TABLE)
				.insert({ date, symptoms: selectedSymptoms, severity, notes });
			if (submitError) throw submitError;

			setSelectedSymptoms([]);
			setSeverity(3);
			setNotes("");
			setDate(new Date().toISOString().split("T")[0]);
			onEntryAdded();
		} catch (err) {
			setError(
				err instanceof Error
					? `Couldn't save the entry — ${err.message}`
					: "Couldn't save the entry. Storage may not be available yet."
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	const chip = (symptom: string) => (
		<button
			key={symptom}
			type="button"
			onClick={() => toggle(symptom)}
			className={`px-3 py-1.5 rounded-full text-[13px] font-medium border transition-colors ${
				selectedSymptoms.includes(symptom)
					? "bg-good/15 border-good/60 text-good"
					: "bg-panel-2 border-edge text-mist hover:text-snow hover:border-faint"
			}`}
		>
			{symptom}
		</button>
	);

	return (
		<form onSubmit={handleSubmit} className="px-6 pb-6 pt-4 space-y-6">
			{/* Date */}
			<div>
				<label className="block text-xs font-medium text-mist mb-2">Date</label>
				<input
					type="date"
					value={date}
					max={new Date().toISOString().split("T")[0]}
					onChange={(e) => setDate(e.target.value)}
					className="w-full px-3 py-2.5"
				/>
			</div>

			{/* Symptoms */}
			<div>
				<div className="flex items-baseline justify-between mb-2">
					<label className="text-xs font-medium text-mist">Symptoms</label>
					{selectedSymptoms.length > 0 && (
						<button
							type="button"
							onClick={() => setSelectedSymptoms([])}
							className="text-xs text-faint hover:text-snow transition-colors"
						>
							Clear ({selectedSymptoms.length})
						</button>
					)}
				</div>
				<p className="text-[11px] uppercase tracking-[0.15em] text-faint mb-2">
					Physical
				</p>
				<div className="flex flex-wrap gap-2 mb-4">
					{physicalSymptoms.map(chip)}
				</div>
				<p className="text-[11px] uppercase tracking-[0.15em] text-faint mb-2">
					Mental
				</p>
				<div className="flex flex-wrap gap-2">{mentalSymptoms.map(chip)}</div>
			</div>

			{/* Severity */}
			<div>
				<div className="flex items-baseline justify-between mb-3">
					<label className="text-xs font-medium text-mist">
						Overall severity
					</label>
					<span className="text-sm tnum" style={{ color: previewColor }}>
						{severityLabel(severity)} · {severity}/8
					</span>
				</div>
				<input
					type="range"
					min="1"
					max="8"
					value={severity}
					onChange={(e) => setSeverity(Number(e.target.value))}
				/>
				<div className="flex justify-between mt-1.5 text-[11px] text-faint">
					<span>Mild</span>
					<span>Very severe</span>
				</div>
			</div>

			{/* Notes */}
			<div>
				<label className="block text-xs font-medium text-mist mb-2">
					Notes
				</label>
				<textarea
					value={notes}
					onChange={(e) => setNotes(e.target.value)}
					placeholder="How are you feeling? Possible triggers, timing, anything worth remembering…"
					rows={3}
					className="w-full px-3 py-2.5 resize-none"
				/>
			</div>

			{error && (
				<div className="flex items-start gap-2 px-3 py-2.5 rounded-xl border border-bad/30 bg-bad/5">
					<AlertCircle className="h-4 w-4 text-bad mt-0.5 shrink-0" />
					<span className="text-sm text-bad">{error}</span>
				</div>
			)}

			<button
				type="submit"
				disabled={isSubmitting || selectedSymptoms.length === 0}
				className="w-full py-3 rounded-full bg-good text-ink text-sm font-semibold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
			>
				{isSubmitting ? "Saving…" : "Save entry"}
			</button>
		</form>
	);
}
