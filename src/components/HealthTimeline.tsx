"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar, Clock } from "lucide-react";
import type { WellnessEntry as SymptomEntry } from "@/lib/types";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";

interface Props {
	entries: SymptomEntry[];
}

export default function HealthTimeline({ entries }: Props) {
	const [selectedEntry, setSelectedEntry] = useState<SymptomEntry | null>(null);
	const [viewMode, setViewMode] = useState<"timeline" | "chart">("timeline");

	const getSeverityColor = (severity: number) => {
		if (severity <= 2) return "bg-green-500";
		if (severity <= 4) return "bg-yellow-500";
		if (severity <= 6) return "bg-orange-500";
		return "bg-red-500";
	};

	const getSeverityText = (severity: number) => {
		if (severity <= 2) return "Mild";
		if (severity <= 4) return "Moderate";
		if (severity <= 6) return "Severe";
		return "Very Severe";
	};

	// Prepare chart data
	const chartData = entries
		.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
		.map((entry) => ({
			date: format(new Date(entry.date), "MMM dd"),
			severity: entry.severity,
			symptoms: entry.symptoms.length,
			fullDate: entry.date,
		}));

	if (entries.length === 0) {
		return (
			<div className="p-8 text-center bg-amber-50 border border-amber-200 rounded-2xl shadow-md mb-8">
				<Calendar className="h-14 w-14 text-orange-500 mx-auto mb-4" />
				<h3 className="text-2xl font-bold text-amber-900 mb-3 flex items-center justify-center gap-2">
					No Entries Yet
				</h3>
				<p className="text-lg text-amber-700 mb-2">
					Start logging your symptoms to see your health timeline.
				</p>
			</div>
		);
	}

	return (
		<div className="p-8">
			<div className="flex justify-between items-center mb-8">
				<h3 className="text-2xl font-bold text-amber-900 flex items-center gap-2">
					<Calendar className="h-8 w-8 bg-orange-100 text-orange-600 rounded-full p-1 mr-2" />
					Health Timeline
				</h3>
				<div className="flex bg-amber-100 rounded-xl p-2 shadow-sm gap-2">
					<button
						onClick={() => setViewMode("timeline")}
						className={`px-4 py-2 rounded-lg text-base font-semibold transition-all duration-150 ${
							viewMode === "timeline"
								? "bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 shadow-md scale-105"
								: "text-amber-600 hover:text-amber-800 hover:bg-orange-50"
						}`}
					>
						Timeline
					</button>
					<button
						onClick={() => setViewMode("chart")}
						className={`px-4 py-2 rounded-lg text-base font-semibold transition-all duration-150 ${
							viewMode === "chart"
								? "bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 shadow-md scale-105"
								: "text-amber-600 hover:text-amber-800 hover:bg-orange-50"
						}`}
					>
						Chart
					</button>
				</div>
			</div>

			{viewMode === "chart" ? (
				<div
					className="border border-amber-200 rounded-lg p-4"
					style={{
						background: "linear-gradient(135deg, #fefcf7 0%, #fef7ed 100%)",
					}}
				>
					<h4 className="font-medium text-amber-900 mb-4">Severity Trend</h4>
					<div className="h-80">
						<ResponsiveContainer
							width="100%"
							height="100%"
						>
							<LineChart data={chartData}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="date" />
								<YAxis domain={[1, 8]} />
								<Tooltip
									labelFormatter={(label) => `Date: ${label}`}
									formatter={(value, name) => [
										name === "severity"
											? `${value} (${getSeverityText(value as number)})`
											: value,
										name === "severity" ? "Severity" : "Symptoms Count",
									]}
								/>
								<Line
									type="monotone"
									dataKey="severity"
									stroke="#ea580c"
									strokeWidth={3}
									dot={{ fill: "#ea580c", strokeWidth: 2, r: 4 }}
								/>
								<Line
									type="monotone"
									dataKey="symptoms"
									stroke="#10b981"
									strokeWidth={2}
									dot={{ fill: "#10b981", strokeWidth: 2, r: 3 }}
								/>
							</LineChart>
						</ResponsiveContainer>
					</div>
					<div className="flex justify-center mt-4 space-x-6">
						<div className="flex items-center">
							<div className="w-3 h-3 bg-gradient-to-r from-orange-600 to-red-600 rounded-full mr-2"></div>
							<span className="text-sm text-amber-800">Severity</span>
						</div>
						<div className="flex items-center">
							<div className="w-3 h-3 bg-emerald-600 rounded-full mr-2"></div>
							<span className="text-sm text-amber-800">Symptom Count</span>
						</div>
					</div>
				</div>
			) : (
				<div className="space-y-4">
					{entries
						.sort(
							(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
						)
						.map((entry, index) => (
							<div
								key={entry.id}
								className="border border-amber-200 rounded-2xl p-6 mb-4 bg-amber-50 shadow-sm hover:shadow-lg transition-all cursor-pointer"
								style={{
									background:
										"linear-gradient(135deg, #fefcf7 0%, #fef7ed 100%)",
								}}
								onClick={() => setSelectedEntry(entry)}
							>
								<div className="flex items-start justify-between">
									<div className="flex items-start space-x-4">
										<div className="flex flex-col items-center">
											<div
												className={`w-4 h-4 rounded-full ${getSeverityColor(
													entry.severity
												)}`}
											></div>
											{index < entries.length - 1 && (
												<div className="w-0.5 h-8 bg-gray-200 mt-2"></div>
											)}
										</div>
										<div className="flex-1">
											<div className="flex items-center space-x-2 mb-2">
												<Clock className="h-4 w-4 text-gray-400" />
												<span className="text-sm font-medium text-gray-900">
													{format(new Date(entry.date), "EEEE, MMMM do, yyyy")}
												</span>
											</div>
											<div className="flex flex-wrap gap-2 mb-2">
												{entry.symptoms.map((symptom, idx) => (
													<span
														key={idx}
														className="px-2 py-1 bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 text-xs rounded-full"
													>
														{symptom}
													</span>
												))}
											</div>
											{entry.notes && (
												<p className="text-sm text-gray-600 mt-2 line-clamp-2">
													{entry.notes}
												</p>
											)}
										</div>
									</div>
									<div className="text-right">
										<div className="text-sm font-medium text-gray-900">
											{getSeverityText(entry.severity)}
										</div>
										<div className="text-xs text-gray-500">
											Severity: {entry.severity}/8
										</div>
									</div>
								</div>
							</div>
						))}
				</div>
			)}

			{/* Entry Detail Modal */}
			{selectedEntry && (
				<div className="fixed inset-0 bg-white bg-opacity-10 flex items-center justify-center z-50 p-4">
					<div className="bg-amber-50 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-xl">
						<div className="p-8">
							<div className="flex justify-between items-start mb-6">
								<h4 className="text-xl font-bold text-amber-900 flex items-center gap-2">
									<Clock className="h-6 w-6 text-orange-500" />
									Entry Details
								</h4>
								<button
									onClick={() => setSelectedEntry(null)}
									className="text-orange-400 hover:text-orange-600 text-2xl font-bold rounded-full bg-orange-100 px-3 py-1 transition-all"
									aria-label="Close"
								>
									✕
								</button>
							</div>

							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-amber-800 mb-1">
										Date
									</label>
									<p className="text-amber-900 font-semibold">
										{format(
											new Date(selectedEntry.date),
											"EEEE, MMMM do, yyyy"
										)}
									</p>
								</div>

								<div>
									<label className="block text-sm font-medium text-amber-800 mb-2">
										Symptoms
									</label>
									<div className="flex flex-wrap gap-2">
										{selectedEntry.symptoms.map((symptom, idx) => (
											<span
												key={idx}
												className="px-3 py-1 bg-gradient-to-r from-orange-200 to-red-100 text-orange-800 text-base rounded-full shadow-sm"
											>
												{symptom}
											</span>
										))}
									</div>
								</div>

								<div>
									<label className="block text-sm font-medium text-amber-800 mb-1">
										Severity
									</label>
									<div className="flex items-center space-x-3">
										<div
											className={`w-5 h-5 rounded-full shadow ${getSeverityColor(
												selectedEntry.severity
											)}`}
										></div>
										<span className="text-orange-900 font-semibold text-base">
											{getSeverityText(selectedEntry.severity)} (
											{selectedEntry.severity}/8)
										</span>
									</div>
								</div>

								{selectedEntry.notes && (
									<div>
										<label className="block text-sm font-medium text-amber-800 mb-1">
											Notes
										</label>
										<p className="text-amber-900 bg-amber-100 p-4 rounded-xl shadow-sm text-base">
											{selectedEntry.notes}
										</p>
									</div>
								)}

								<div>
									<label className="block text-sm font-medium text-amber-800 mb-1">
										Recorded
									</label>
									<p className="text-base text-orange-700 font-semibold">
										{format(new Date(selectedEntry.created_at), "PPpp")}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
