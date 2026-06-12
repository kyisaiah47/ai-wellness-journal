"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import {
	Area,
	AreaChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { lastNDays, type DayPoint } from "@/lib/score";

interface Props {
	points: DayPoint[];
	onLog: () => void;
}

type Range = 14 | 30 | 90;
type Metric = "score" | "severity" | "symptoms";

const METRICS: { id: Metric; label: string }[] = [
	{ id: "score", label: "Score" },
	{ id: "severity", label: "Severity" },
	{ id: "symptoms", label: "Symptoms" },
];

const METRIC_COLOR: Record<Metric, string> = {
	score: "#2dd4bf",
	severity: "#f87171",
	symptoms: "#facc15",
};

export default function TrendChart({ points, onLog }: Props) {
	const [range, setRange] = useState<Range>(30);
	const [metric, setMetric] = useState<Metric>("score");

	const data = useMemo(
		() =>
			lastNDays(points, range).map((p) => ({
				...p,
				label: format(new Date(p.date + "T00:00:00"), "MMM d"),
			})),
		[points, range]
	);

	const color = METRIC_COLOR[metric];
	const domain: [number, number] =
		metric === "score" ? [0, 100] : metric === "severity" ? [1, 8] : [0, 10];

	return (
		<div className="rounded-2xl bg-panel border border-edge px-6 py-6">
			<div className="flex flex-wrap items-center justify-between gap-3 mb-6">
				<h2 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-mist">
					Trends
				</h2>
				<div className="flex items-center gap-4">
					<div className="flex gap-1">
						{METRICS.map((m) => (
							<button
								key={m.id}
								onClick={() => setMetric(m.id)}
								className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
									metric === m.id
										? "bg-panel-2 text-snow border border-edge"
										: "text-faint hover:text-mist border border-transparent"
								}`}
							>
								{m.label}
							</button>
						))}
					</div>
					<div className="flex gap-1">
						{([14, 30, 90] as Range[]).map((r) => (
							<button
								key={r}
								onClick={() => setRange(r)}
								className={`px-3 py-1 rounded-full text-xs tnum font-medium transition-colors ${
									range === r
										? "bg-panel-2 text-snow border border-edge"
										: "text-faint hover:text-mist border border-transparent"
								}`}
							>
								{r}d
							</button>
						))}
					</div>
				</div>
			</div>

			{data.length < 2 ? (
				<div className="h-64 flex flex-col items-center justify-center gap-3">
					<p className="text-sm text-faint">
						{data.length === 0
							? "Nothing logged in this window yet."
							: "Log one more day to start a trend line."}
					</p>
					<button
						onClick={onLog}
						className="text-sm font-medium text-good hover:underline underline-offset-4"
					>
						Log today&apos;s entry →
					</button>
				</div>
			) : (
				<div className="h-64">
					<ResponsiveContainer width="100%" height="100%">
						<AreaChart
							data={data}
							margin={{ top: 4, right: 4, bottom: 0, left: -16 }}
						>
							<defs>
								<linearGradient id={`fill-${metric}`} x1="0" y1="0" x2="0" y2="1">
									<stop offset="0%" stopColor={color} stopOpacity={0.28} />
									<stop offset="100%" stopColor={color} stopOpacity={0} />
								</linearGradient>
							</defs>
							<CartesianGrid
								stroke="#1c242c"
								strokeDasharray="0"
								vertical={false}
							/>
							<XAxis
								dataKey="label"
								tick={{ fill: "#5b6770", fontSize: 11 }}
								axisLine={{ stroke: "#1f2933" }}
								tickLine={false}
								minTickGap={28}
							/>
							<YAxis
								domain={domain}
								tick={{ fill: "#5b6770", fontSize: 11 }}
								axisLine={false}
								tickLine={false}
								width={40}
							/>
							<Tooltip
								contentStyle={{
									background: "#161d24",
									border: "1px solid #1f2933",
									borderRadius: 10,
									fontSize: 12,
									color: "#e6edf3",
								}}
								labelStyle={{ color: "#8b98a5" }}
								formatter={(value: number | string) => [
									value,
									metric === "score"
										? "Wellness score"
										: metric === "severity"
										? "Severity (1–8)"
										: "Symptom count",
								]}
							/>
							<Area
								type="monotone"
								dataKey={
									metric === "score"
										? "score"
										: metric === "severity"
										? "severity"
										: "symptomCount"
								}
								stroke={color}
								strokeWidth={2.5}
								fill={`url(#fill-${metric})`}
								dot={false}
								activeDot={{ r: 4, strokeWidth: 0, fill: color }}
							/>
						</AreaChart>
					</ResponsiveContainer>
				</div>
			)}
		</div>
	);
}
