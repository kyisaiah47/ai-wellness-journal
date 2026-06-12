"use client";

import { useState } from "react";
import { Brain, TrendingUp, AlertTriangle, RefreshCw } from "lucide-react";
import type {
	SymptomAnalysis,
	WellnessEntry as SymptomEntry,
} from "@/lib/types";

interface Props {
	entries: SymptomEntry[];
}

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
		} catch (err: unknown) {
			setError("Failed to generate AI insights. Please try again.");
			console.error("AI Insights Error:", err);
		} finally {
			setLoading(false);
		}
	};

	const getUrgencyColor = (urgency: string) => {
		switch (urgency) {
			case "high":
				return "text-red-600 bg-red-100";
			case "medium":
				return "text-yellow-600 bg-yellow-100";
			default:
				return "text-green-600 bg-green-100";
		}
	};

	// Removed unused function getUrgencyIcon

	if (entries.length === 0) {
		return (
			<div className="p-8 text-center bg-amber-50 border border-amber-200 rounded-2xl shadow-md mb-8">
				<Brain className="h-14 w-14 text-orange-500 mx-auto mb-4" />
				<h3 className="text-2xl font-bold text-amber-900 mb-3 flex items-center justify-center gap-2">
					No Data Yet
				</h3>
				<p className="text-lg text-amber-700 mb-2">
					Add some symptom entries to see AI-powered insights about your health
					patterns.
				</p>
			</div>
		);
	}

	return (
		<div className="p-8">
			<div className="flex justify-between items-center mb-8">
				<h3 className="text-2xl font-bold text-amber-900 flex items-center gap-2">
					<Brain className="h-8 w-8 bg-orange-100 text-orange-600 rounded-full p-1 mr-2" />
					AI Health Insights
				</h3>
				<button
					onClick={generateInsights}
					disabled={loading}
					className="flex items-center px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl hover:from-orange-700 hover:to-red-700 disabled:bg-gray-400 transition-all shadow-lg text-base font-semibold"
				>
					<RefreshCw
						className={`h-5 w-5 mr-2 ${loading ? "animate-spin" : ""}`}
					/>
					{loading ? "Analyzing..." : "Refresh"}
				</button>
			</div>

			{error && (
				<div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
					<div className="flex items-center">
						<AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
						<span className="text-sm text-red-700">{error}</span>
					</div>
				</div>
			)}

			{loading && (
				<div className="text-center py-8">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
					<p className="text-amber-700">
						AI is analyzing your health patterns...
					</p>
				</div>
			)}

			{/* Overall Health Analysis */}
			{analysis && !loading && (
				<div className="mb-8">
					<div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-6 border border-orange-200">
						<div className="flex items-start justify-between mb-4">
							<h4 className="text-lg font-medium text-amber-900">
								Health Summary
							</h4>
							<div
								className={`px-3 py-1 rounded-full text-sm font-medium ${getUrgencyColor(
									analysis.urgency
								)}`}
							>
								{analysis.urgency.charAt(0).toUpperCase() +
									analysis.urgency.slice(1)}{" "}
								Priority
							</div>
						</div>
						<p className="text-amber-800 mb-4">{analysis.summary}</p>

						{analysis.recommendations &&
							analysis.recommendations.length > 0 && (
								<div className="mt-4">
									<h5 className="font-medium text-amber-900 mb-2">
										Recommendations:
									</h5>
									<ul className="space-y-1">
										{analysis.recommendations.map(
											(rec: string, index: number) => (
												<li
													key={index}
													className="text-sm text-amber-800 flex items-start"
												>
													<span className="text-orange-500 mr-2">•</span>
													{rec}
												</li>
											)
										)}
									</ul>
								</div>
							)}
					</div>
				</div>
			)}

			{/* Pattern Insights */}
			{insights.length > 0 && !loading && (
				<div className="mb-8">
					<h4 className="text-lg font-medium text-amber-900 mb-4">
						Pattern Analysis
					</h4>
					<div className="grid gap-4">
						{insights.map((insight, index) => (
							<div
								key={index}
								className="bg-amber-25 border border-amber-200 rounded-lg p-4 hover:shadow-md transition-shadow"
								style={{
									background:
										"linear-gradient(135deg, #fefcf7 0%, #fef7ed 100%)",
								}}
							>
								<div className="flex items-start">
									<TrendingUp className="h-5 w-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
									<p className="text-amber-800 text-sm">{insight}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Quick Stats */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
				<div
					className="border border-amber-200 rounded-lg p-4"
					style={{
						background: "linear-gradient(135deg, #fefcf7 0%, #fef7ed 100%)",
					}}
				>
					<div className="text-center">
						<p className="text-2xl font-bold text-amber-700">
							{entries.length}
						</p>
						<p className="text-sm text-amber-600">Total Entries</p>
					</div>
				</div>

				<div
					className="border border-amber-200 rounded-lg p-4"
					style={{
						background: "linear-gradient(135deg, #fefcf7 0%, #fef7ed 100%)",
					}}
				>
					<div className="text-center">
						<p className="text-2xl font-bold text-emerald-700">
							{Math.round(
								(entries.reduce((sum, entry) => sum + entry.severity, 0) /
									entries.length) *
									10
							) / 10}
						</p>
						<p className="text-sm text-amber-600">Avg Severity</p>
					</div>
				</div>

				<div
					className="border border-amber-200 rounded-lg p-4"
					style={{
						background: "linear-gradient(135deg, #fefcf7 0%, #fef7ed 100%)",
					}}
				>
					<div className="text-center">
						<p className="text-2xl font-bold text-orange-700">
							{
								Array.from(new Set(entries.flatMap((entry) => entry.symptoms)))
									.length
							}
						</p>
						<p className="text-sm text-amber-600">Unique Symptoms</p>
					</div>
				</div>
			</div>

			{/* Most Common Symptoms */}
			<div
				className="border border-amber-200 rounded-lg p-4 mb-6"
				style={{
					background: "linear-gradient(135deg, #fefcf7 0%, #fef7ed 100%)",
				}}
			>
				<h5 className="font-medium text-amber-900 mb-3">
					Most Common Symptoms
				</h5>
				<div className="space-y-2">
					{(() => {
						const symptomCounts = entries.reduce((acc, entry) => {
							entry.symptoms.forEach((symptom) => {
								acc[symptom] = (acc[symptom] || 0) + 1;
							});
							return acc;
						}, {} as Record<string, number>);

						return Object.entries(symptomCounts)
							.sort(([, a], [, b]) => b - a)
							.slice(0, 5)
							.map(([symptom, count]) => (
								<div
									key={symptom}
									className="flex justify-between items-center"
								>
									<span className="text-sm text-amber-800">{symptom}</span>
									<div className="flex items-center">
										<div className="w-20 bg-amber-200 rounded-full h-2 mr-2">
											<div
												className="bg-gradient-to-r from-orange-600 to-red-600 h-2 rounded-full"
												style={{ width: `${(count / entries.length) * 100}%` }}
											></div>
										</div>
										<span className="text-sm text-gray-600">{count}</span>
									</div>
								</div>
							));
					})()}
				</div>
			</div>

			{/* Disclaimer */}
			<div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
				<div className="flex items-start">
					<AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
					<div>
						<p className="text-sm text-yellow-800 font-medium">
							Medical Disclaimer
						</p>
						<p className="text-sm text-yellow-700 mt-1">
							These AI insights are for informational purposes only and should
							not replace professional medical advice. Always consult with a
							healthcare provider for medical concerns.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
