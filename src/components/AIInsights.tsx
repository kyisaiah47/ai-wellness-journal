"use client";

import { useState } from "react";
import { AlertTriangle, RefreshCw, Sparkles } from "lucide-react";
import type { SymptomAnalysis, WellnessEntry } from "@/lib/types";

interface Props {
	entries: WellnessEntry[];
}

const URGENCY_STYLE: Record<string, { color: string; label: string }> = {
	low: { color: "#2dd4bf", label: "Low priority" },
	medium: { color: "#facc15", label: "Medium priority" },
	high: { color: "#f87171", label: "High priority" },
};

export default function AIInsights({ entries }: Props) {
	const [insights, setInsights] = useState<string[]>([]);
	const [analysis, setAnalysis] = useState<SymptomAnalysis | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const generateInsights = async () => {
		setLoading(true);
		setError("");
		try {
			// Both calls go through the server-side API route so the
			// Anthropic key stays server-side only.
			const [insightsRes, analysisRes] = await Promise.all([
				fetch("/api/analyze", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ action: "insights", entries }),
				}),
				fetch("/api/analyze", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ action: "analyze", entries }),
				}),
			]);
			if (!insightsRes.ok || !analysisRes.ok) {
				throw new Error("Analysis request failed");
			}
			const { insights: healthInsights } = await insightsRes.json();
			setInsights(healthInsights);
			setAnalysis(await analysisRes.json());
		} catch (err) {
			setError("Couldn't generate insights right now. Try again in a moment.");
			console.error("AI Insights Error:", err);
		} finally {
			setLoading(false);
		}
	};

	if (entries.length === 0) {
		return (
			<div className="px-6 py-16 text-center">
				<p className="text-sm text-faint">
					Log a few entries first — insights are generated from your own data.
				</p>
			</div>
		);
	}

	const urgency = analysis ? URGENCY_STYLE[analysis.urgency] : null;

	return (
		<div className="px-6 py-5">
			<div className="flex items-center justify-between mb-5">
				<h2 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-mist">
					AI insights
				</h2>
				<button
					onClick={generateInsights}
					disabled={loading}
					className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-panel-2 border border-edge text-sm font-medium text-snow hover:border-faint disabled:opacity-50 transition-colors"
				>
					{analysis ? (
						<RefreshCw
							className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
						/>
					) : (
						<Sparkles className="h-3.5 w-3.5 text-good" />
					)}
					{loading ? "Analyzing…" : analysis ? "Refresh" : "Generate"}
				</button>
			</div>

			{error && (
				<div className="mb-4 flex items-start gap-2 px-3 py-2.5 rounded-xl border border-bad/30 bg-bad/5">
					<AlertTriangle className="h-4 w-4 text-bad mt-0.5 shrink-0" />
					<span className="text-sm text-bad">{error}</span>
				</div>
			)}

			{!analysis && !loading && !error && (
				<p className="text-sm text-faint pb-4">
					Generate a summary, pattern analysis, and self-care suggestions from
					your last {entries.length} entr{entries.length === 1 ? "y" : "ies"}.
					Entries are processed by Anthropic&apos;s Claude API.
				</p>
			)}

			{loading && (
				<div className="py-10 text-center">
					<p className="text-sm text-faint animate-pulse">
						Reading your entries…
					</p>
				</div>
			)}

			{analysis && !loading && (
				<div className="space-y-5 pb-2">
					{/* Summary */}
					<div className="rounded-xl bg-panel-2 border border-edge p-5">
						<div className="flex items-center justify-between mb-3">
							<p className="text-xs font-medium uppercase tracking-[0.15em] text-faint">
								Summary
							</p>
							{urgency && (
								<span
									className="text-xs font-medium px-2.5 py-1 rounded-full border"
									style={{
										color: urgency.color,
										borderColor: `${urgency.color}55`,
										background: `${urgency.color}11`,
									}}
								>
									{urgency.label}
								</span>
							)}
						</div>
						<p className="text-sm text-snow leading-relaxed">
							{analysis.summary}
						</p>
					</div>

					{/* Patterns */}
					{insights.length > 0 && (
						<div>
							<p className="text-xs font-medium uppercase tracking-[0.15em] text-faint mb-3">
								Patterns
							</p>
							<ul className="space-y-2.5">
								{insights.map((insight, i) => (
									<li key={i} className="flex items-start gap-3 text-sm">
										<span className="h-1.5 w-1.5 rounded-full bg-good mt-1.5 shrink-0" />
										<span className="text-mist leading-relaxed">{insight}</span>
									</li>
								))}
							</ul>
						</div>
					)}

					{/* Recommendations */}
					{analysis.recommendations.length > 0 && (
						<div>
							<p className="text-xs font-medium uppercase tracking-[0.15em] text-faint mb-3">
								Suggestions
							</p>
							<ul className="space-y-2.5">
								{analysis.recommendations.map((rec, i) => (
									<li key={i} className="flex items-start gap-3 text-sm">
										<span className="h-1.5 w-1.5 rounded-full bg-faint mt-1.5 shrink-0" />
										<span className="text-mist leading-relaxed">{rec}</span>
									</li>
								))}
							</ul>
						</div>
					)}

					<p className="text-[11px] text-faint leading-relaxed pt-1">
						AI-generated from your own logs — informational only, not medical
						advice or a diagnosis.
					</p>
				</div>
			)}
		</div>
	);
}
