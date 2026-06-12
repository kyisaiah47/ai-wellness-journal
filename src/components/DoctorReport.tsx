"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Download, FileText, Loader, Printer } from "lucide-react";
import type { SymptomAnalysis, WellnessEntry } from "@/lib/types";
import { supabase, REPORTS_TABLE } from "@/lib/supabase";

interface Props {
	entries: WellnessEntry[];
}

type Report = SymptomAnalysis & { entries: WellnessEntry[] };

const URGENCY_STYLE: Record<string, { color: string; label: string }> = {
	low: { color: "#2dd4bf", label: "Low priority" },
	medium: { color: "#facc15", label: "Medium priority" },
	high: { color: "#f87171", label: "High priority" },
};

const escapeHtml = (s: string) =>
	s
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");

export default function DoctorReport({ entries }: Props) {
	const [generating, setGenerating] = useState(false);
	const [error, setError] = useState("");
	const [report, setReport] = useState<Report | null>(null);
	const [dateRange, setDateRange] = useState({
		start: entries.length > 0 ? entries[entries.length - 1]?.date || "" : "",
		end: entries.length > 0 ? entries[0]?.date || "" : "",
	});

	const generateReport = async () => {
		setGenerating(true);
		setError("");
		try {
			const filtered = entries.filter((entry) => {
				const d = new Date(entry.date);
				return d >= new Date(dateRange.start) && d <= new Date(dateRange.end);
			});
			if (filtered.length === 0) {
				setError("No entries in the selected period.");
				return;
			}

			const res = await fetch("/api/analyze", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ action: "analyze", entries: filtered }),
			});
			if (!res.ok) throw new Error("Analysis request failed");
			const analysis: SymptomAnalysis = await res.json();
			setReport({ ...analysis, entries: filtered });

			// Best-effort archive of the report; ignore failure (e.g. table not
			// provisioned yet) — the on-screen report still works.
			supabase
				.from(REPORTS_TABLE)
				.insert({
					period_start: dateRange.start,
					period_end: dateRange.end,
					analysis,
				})
				.then(({ error: saveError }) => {
					if (saveError) console.warn("Report not archived:", saveError.message);
				});
		} catch (err) {
			console.error("Error generating report:", err);
			setError("Couldn't generate the report right now. Try again in a moment.");
		} finally {
			setGenerating(false);
		}
	};

	/** Clean, print-ready standalone HTML document. */
	const reportHtml = () => {
		if (!report) return "";
		const period = `${format(new Date(dateRange.start), "PP")} – ${format(
			new Date(dateRange.end),
			"PP"
		)}`;
		const urgency = URGENCY_STYLE[report.urgency];
		const list = (items: string[]) =>
			items.length
				? `<ul>${items.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</ul>`
				: "<p>None noted.</p>";

		return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Symptom Summary Report — ${period}</title>
<style>
	body { font-family: -apple-system, "Segoe UI", Helvetica, Arial, sans-serif; color: #1a1a1a; max-width: 720px; margin: 48px auto; padding: 0 24px; line-height: 1.55; font-size: 14px; }
	h1 { font-size: 21px; margin: 0 0 4px; }
	h2 { font-size: 13px; text-transform: uppercase; letter-spacing: 0.08em; color: #555; border-bottom: 1px solid #ddd; padding-bottom: 6px; margin: 28px 0 10px; }
	.meta { color: #666; font-size: 13px; margin-bottom: 4px; }
	.urgency { display: inline-block; font-weight: 600; }
	table { width: 100%; border-collapse: collapse; font-size: 13px; }
	th, td { text-align: left; padding: 7px 10px 7px 0; border-bottom: 1px solid #eee; vertical-align: top; }
	th { color: #555; font-weight: 600; }
	ul { margin: 6px 0; padding-left: 20px; }
	li { margin-bottom: 4px; }
	.disclaimer { margin-top: 36px; padding: 14px 16px; border: 1px solid #ccc; border-radius: 6px; font-size: 12px; color: #555; }
	@media print { body { margin: 0 auto; } }
</style>
</head>
<body>
	<h1>Symptom Summary Report</h1>
	<p class="meta">Period: ${period} &nbsp;·&nbsp; Generated ${format(
			new Date(),
			"PPp"
		)} &nbsp;·&nbsp; Source: patient-logged entries (Charted)</p>
	<p class="meta">Suggested follow-up urgency: <span class="urgency">${escapeHtml(
		urgency.label
	)}</span></p>

	<h2>Summary</h2>
	<p>${escapeHtml(report.summary)}</p>

	<h2>Logged entries (${report.entries.length})</h2>
	<table>
		<tr><th>Date</th><th>Symptoms</th><th>Severity</th><th>Notes</th></tr>
		${report.entries
			.map(
				(e) =>
					`<tr><td>${format(new Date(e.date + "T00:00:00"), "MMM d, yyyy")}</td><td>${escapeHtml(
						e.symptoms.join(", ")
					)}</td><td>${e.severity}/8</td><td>${escapeHtml(e.notes || "—")}</td></tr>`
			)
			.join("")}
	</table>

	<h2>Observed patterns</h2>
	${list(report.patterns)}

	<h2>Notes for the physician</h2>
	<p>${escapeHtml(report.doctorNotes)}</p>

	<div class="disclaimer">
		<strong>Not medical advice.</strong> This report was generated by an AI system
		(Anthropic Claude) from patient-logged symptom entries. It is supplementary
		information only — not a diagnosis and not a substitute for professional
		medical examination. Severity values are the patient's self-rating on a 1–8 scale.
	</div>
</body>
</html>`;
	};

	const exportReport = () => {
		const blob = new Blob([reportHtml()], { type: "text/html" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `symptom-report-${format(new Date(), "yyyy-MM-dd")}.html`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};

	const printReport = () => {
		const w = window.open("", "_blank");
		if (!w) return;
		w.document.write(reportHtml());
		w.document.close();
		w.focus();
		w.print();
	};

	if (entries.length === 0) {
		return (
			<div className="px-6 py-16 text-center">
				<p className="text-sm text-faint">
					Log some entries first — the report is built from your own data.
				</p>
			</div>
		);
	}

	const urgency = report ? URGENCY_STYLE[report.urgency] : null;

	return (
		<div className="px-6 py-5">
			<div className="flex items-center justify-between mb-5">
				<h2 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-mist">
					Doctor report
				</h2>
				{report && (
					<div className="flex gap-2">
						<button
							onClick={exportReport}
							className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-panel-2 border border-edge text-sm font-medium text-snow hover:border-faint transition-colors"
						>
							<Download className="h-3.5 w-3.5" />
							Export HTML
						</button>
						<button
							onClick={printReport}
							className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-panel-2 border border-edge text-sm font-medium text-snow hover:border-faint transition-colors"
						>
							<Printer className="h-3.5 w-3.5" />
							Print
						</button>
					</div>
				)}
			</div>

			{/* Parameters */}
			<div className="grid sm:grid-cols-[1fr_1fr_auto] gap-3 items-end mb-6">
				<div>
					<label className="block text-xs font-medium text-mist mb-2">
						From
					</label>
					<input
						type="date"
						value={dateRange.start}
						onChange={(e) =>
							setDateRange((p) => ({ ...p, start: e.target.value }))
						}
						className="w-full px-3 py-2.5"
					/>
				</div>
				<div>
					<label className="block text-xs font-medium text-mist mb-2">To</label>
					<input
						type="date"
						value={dateRange.end}
						onChange={(e) =>
							setDateRange((p) => ({ ...p, end: e.target.value }))
						}
						className="w-full px-3 py-2.5"
					/>
				</div>
				<button
					onClick={generateReport}
					disabled={generating || !dateRange.start || !dateRange.end}
					className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-good text-ink text-sm font-semibold hover:opacity-90 disabled:opacity-40 transition-opacity"
				>
					{generating ? (
						<>
							<Loader className="h-4 w-4 animate-spin" />
							Generating…
						</>
					) : (
						<>
							<FileText className="h-4 w-4" />
							Generate
						</>
					)}
				</button>
			</div>

			{error && <p className="text-sm text-bad mb-4">{error}</p>}

			{/* Report preview */}
			{report && urgency && (
				<div className="rounded-xl bg-panel-2 border border-edge overflow-hidden">
					<div className="px-5 py-4 border-b border-edge flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-snow">
								Symptom Summary Report
							</p>
							<p className="text-xs text-faint mt-0.5">
								{format(new Date(dateRange.start), "PP")} –{" "}
								{format(new Date(dateRange.end), "PP")} ·{" "}
								{report.entries.length} entries
							</p>
						</div>
						<span
							className="text-xs font-medium px-2.5 py-1 rounded-full border shrink-0"
							style={{
								color: urgency.color,
								borderColor: `${urgency.color}55`,
								background: `${urgency.color}11`,
							}}
						>
							{urgency.label}
						</span>
					</div>

					<div className="px-5 py-4 space-y-5">
						<div>
							<p className="text-xs font-medium uppercase tracking-[0.15em] text-faint mb-2">
								Summary
							</p>
							<p className="text-sm text-mist leading-relaxed">
								{report.summary}
							</p>
						</div>

						{report.patterns.length > 0 && (
							<div>
								<p className="text-xs font-medium uppercase tracking-[0.15em] text-faint mb-2">
									Observed patterns
								</p>
								<ul className="space-y-2">
									{report.patterns.map((p, i) => (
										<li key={i} className="flex items-start gap-3 text-sm">
											<span className="h-1.5 w-1.5 rounded-full bg-good mt-1.5 shrink-0" />
											<span className="text-mist leading-relaxed">{p}</span>
										</li>
									))}
								</ul>
							</div>
						)}

						<div>
							<p className="text-xs font-medium uppercase tracking-[0.15em] text-faint mb-2">
								Notes for the physician
							</p>
							<p className="text-sm text-mist leading-relaxed whitespace-pre-wrap">
								{report.doctorNotes}
							</p>
						</div>
					</div>

					<div className="px-5 py-3.5 border-t border-edge">
						<p className="text-[11px] text-faint leading-relaxed">
							Not medical advice. AI-generated from patient-logged entries —
							supplementary information for a healthcare provider, not a
							diagnosis. The exported report carries this disclaimer too.
						</p>
					</div>
				</div>
			)}
		</div>
	);
}
