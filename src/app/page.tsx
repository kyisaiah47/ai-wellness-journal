"use client";

import { useEffect, useMemo, useState } from "react";
import { format, subDays, isSameDay } from "date-fns";
import { X } from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import { supabase, ENTRIES_TABLE } from "@/lib/supabase";
import WelcomeModal from "@/components/WelcomeModal";
import { SAMPLE_ENTRIES } from "@/lib/sample";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { WellnessEntry } from "@/lib/types";
import {
	dailyPoints,
	avg,
	bandForScore,
	BAND_COLOR,
	BAND_LABEL,
	BAND_GRADIENT,
} from "@/lib/score";
import DayBlob from "@/components/DayBlob";
import SymptomEntryForm from "@/components/SymptomEntryForm";
import HealthTimeline from "@/components/HealthTimeline";
import AIInsights from "@/components/AIInsights";
import DoctorReport from "@/components/DoctorReport";
import TrendChart from "@/components/TrendChart";

type Tab = "timeline" | "insights" | "report";

export default function Dashboard() {
	const [entries, setEntries] = useState<WellnessEntry[]>([]);
	const [activeTab, setActiveTab] = useState<Tab>("timeline");
	const [loading, setLoading] = useState(true);
	const [dbUnavailable, setDbUnavailable] = useState(false);
	const [showLog, setShowLog] = useState(false);
	const [session, setSession] = useState<Session | null>(null);
	const [authReady, setAuthReady] = useState(false);
	const [showWelcome, setShowWelcome] = useState(false);
	const demo = authReady && !session;

	useEffect(() => {
		supabase.auth.getSession().then(({ data }) => {
			setSession(data.session);
			setAuthReady(true);
		});
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, newSession) => {
			setSession(newSession);
		});
		return () => subscription.unsubscribe();
	}, []);

	useEffect(() => {
		if (!authReady) return;
		if (session) {
			setShowWelcome(false);
			setLoading(true);
			loadEntries();
		} else {
			// Signed out: open the journal with sample data + the welcome story.
			setEntries(SAMPLE_ENTRIES);
			setLoading(false);
			setShowWelcome(true);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [authReady, session?.user.id]);

	const loadEntries = async () => {
		try {
			const { data, error } = await supabase
				.from(ENTRIES_TABLE)
				.select("*")
				.order("date", { ascending: false });

			if (error) throw error;
			setEntries(data || []);
			setDbUnavailable(false);
		} catch (error) {
			// Table not provisioned yet / network issue — degrade to empty state.
			console.error("Error loading entries:", error);
			setDbUnavailable(true);
			setEntries([]);
		} finally {
			setLoading(false);
		}
	};

	const points = useMemo(() => dailyPoints(entries), [entries]);
	const today = new Date();
	const todayKey = format(today, "yyyy-MM-dd");
	const todayPoint = points.find((p) => p.date === todayKey) ?? null;
	const score = todayPoint ? todayPoint.score : null;
	const band = score === null ? null : bandForScore(score);

	// 7-day windows for contributors / deltas
	const last7 = useMemo(
		() => points.filter((p) => new Date(p.date) >= subDays(today, 6)),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[points]
	);
	const prior7 = useMemo(
		() =>
			points.filter(
				(p) =>
					new Date(p.date) >= subDays(today, 13) &&
					new Date(p.date) < subDays(today, 6)
			),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[points]
	);

	const avg7Score = avg(last7.map((p) => p.score));
	const avgPrior7Score = avg(prior7.map((p) => p.score));
	const avg7Severity = avg(last7.map((p) => p.severity));
	const avgPrior7Severity = avg(prior7.map((p) => p.severity));
	const uniqueSymptoms7 = new Set(
		entries
			.filter((e) => new Date(e.date) >= subDays(today, 6))
			.flatMap((e) => e.symptoms)
	).size;
	const uniqueSymptomsPrior7 = new Set(
		entries
			.filter(
				(e) =>
					new Date(e.date) >= subDays(today, 13) &&
					new Date(e.date) < subDays(today, 6)
			)
			.flatMap((e) => e.symptoms)
	).size;
	const bestScore7 = last7.length
		? Math.max(...last7.map((p) => p.score))
		: null;

	// Whoop-style 7-day calendar strip
	const strip = Array.from({ length: 7 }, (_, i) => {
		const d = subDays(today, 6 - i);
		const key = format(d, "yyyy-MM-dd");
		const p = points.find((pt) => pt.date === key) ?? null;
		return { date: d, point: p, isToday: isSameDay(d, today) };
	});


	if (!authReady) {
		return <div className="min-h-screen" />;
	}

	const openLog = () => (demo ? setShowWelcome(true) : setShowLog(true));

	return (
		<SidebarProvider
			style={
				{
					"--sidebar-width": "calc(var(--spacing) * 72)",
					"--header-height": "calc(var(--spacing) * 12)",
				} as React.CSSProperties
			}
		>
			<AppSidebar
				variant="inset"
				active={activeTab}
				onSectionSelect={setActiveTab}
				demo={demo}
				onLog={openLog}
				onSignOut={() => supabase.auth.signOut()}
			/>
			<SidebarInset>
				<SiteHeader demo={demo} onLog={openLog} />
				<div className="flex flex-1 flex-col p-4 md:p-6 max-w-6xl w-full mx-auto">
				{dbUnavailable && !demo && (
					<div className="mb-6 px-4 py-3 rounded-xl border border-warn/30 bg-warn/5 text-sm text-warn">
						Couldn&apos;t reach the journal database — entries can&apos;t be
						loaded or saved yet. The dashboard below will fill in once storage
						is available.
					</div>
				)}

				{activeTab === "timeline" && (
				<>
				{/* Greeting */}
				<div className="mb-6 flex items-end justify-between animate-fade-up">
					<div>
						<p className="text-sm text-mist">
							{demo ? "Welcome to Charted — this is a sample month" : "Welcome back"}
						</p>
						<h1 className="font-display text-2xl font-bold text-snow">
							How are you feeling today?
						</h1>
					</div>
					<div className="hidden md:flex gap-2">
						{strip.map(({ date, point, isToday }) => {
							const color = point ? BAND_COLOR[bandForScore(point.score)] : null;
							return (
								<div
									key={date.toISOString()}
									title={format(date, "EEEE d")}
									className={`h-8 w-8 rounded-full flex items-center justify-center text-xs tnum font-medium ${
										isToday ? "ring-2 ring-snow/50" : ""
									}`}
									style={{
										background: color ? `${color}22` : "#ffffff",
										color: color ?? "#bcb0a2",
									}}
								>
									{format(date, "d")}
								</div>
							);
						})}
					</div>
				</div>

				{/* Hero: today's day-card + breakdown */}
				<section className="grid lg:grid-cols-[minmax(0,420px)_1fr] gap-4 mb-4">
					<div
						className="relative rounded-3xl px-7 py-7 flex flex-col justify-between overflow-hidden animate-fade-up-delay-1 min-h-[260px]"
						style={{ background: BAND_GRADIENT[band ?? "none"] }}
					>
						<DayBlob
							band={band ?? "none"}
							className="absolute -right-8 -bottom-10 h-48 w-48 opacity-95"
						/>
						<div className="relative">
							<p className="text-sm font-semibold text-snow/70">
								{format(today, "EEEE, MMMM d")}
							</p>
						</div>
						<div className="relative">
							<p className="font-display text-6xl font-bold tnum text-snow">
								{loading ? "–" : score !== null ? score : "–"}
							</p>
							<p className="mt-1 text-base font-semibold text-snow/85">
								{loading
									? "One sec…"
									: band
									? BAND_LABEL[band]
									: "Nothing logged yet today"}
							</p>
							{!loading && !band && (
								<button
									onClick={() => (demo ? setShowWelcome(true) : setShowLog(true))}
									className="mt-3 px-4 py-2 rounded-full bg-spark text-white text-sm font-semibold hover:opacity-90 transition-opacity"
								>
									How was today?
								</button>
							)}
						</div>
					</div>

					<div className="rounded-3xl card px-6 py-6 animate-fade-up-delay-2">
						<h2 className="text-sm font-display font-semibold text-snow mb-5">
							Today, up close
						</h2>
						<div className="space-y-5">
							<Contributor
								label="Severity"
								display={
									todayPoint ? `${todayPoint.severity.toFixed(1)} / 8` : "--"
								}
								fraction={
									todayPoint ? 1 - (todayPoint.severity - 1) / 7 : null
								}
								delta={deltaText(avgPrior7Severity, avg7Severity)}
								deltaGood={isImprovement(avgPrior7Severity, avg7Severity, true)}
							/>
							<Contributor
								label="Symptom load"
								display={
									todayPoint
										? `${todayPoint.symptomCount} symptom${
												todayPoint.symptomCount === 1 ? "" : "s"
										  }`
										: "--"
								}
								fraction={
									todayPoint
										? 1 - Math.min(todayPoint.symptomCount, 6) / 6
										: null
								}
								delta={
									uniqueSymptomsPrior7 || uniqueSymptoms7
										? deltaText(uniqueSymptomsPrior7, uniqueSymptoms7)
										: null
								}
								deltaGood={isImprovement(
									uniqueSymptomsPrior7,
									uniqueSymptoms7,
									true
								)}
							/>
							<Contributor
								label="7-day balance"
								display={avg7Score !== null ? Math.round(avg7Score).toString() : "--"}
								fraction={avg7Score !== null ? avg7Score / 100 : null}
								delta={deltaText(avgPrior7Score, avg7Score)}
								deltaGood={isImprovement(avgPrior7Score, avg7Score, false)}
							/>
							<Contributor
								label="Consistency"
								display={`${last7.length} / 7 days`}
								fraction={last7.length / 7}
								delta={null}
								deltaGood={null}
							/>
						</div>
					</div>
				</section>

				{/* Stat cards */}
				<section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4 animate-fade-up-delay-3">
					<StatCard
						label="Avg severity · 7d"
						value={avg7Severity !== null ? avg7Severity.toFixed(1) : "--"}
						delta={deltaText(avgPrior7Severity, avg7Severity)}
						deltaGood={isImprovement(avgPrior7Severity, avg7Severity, true)}
					/>
					<StatCard
						label="Days logged · 7d"
						value={String(last7.length)}
						delta={
							prior7.length || last7.length
								? deltaText(prior7.length, last7.length)
								: null
						}
						deltaGood={isImprovement(prior7.length, last7.length, false)}
					/>
					<StatCard
						label="Symptoms · 7d"
						value={entries.length ? String(uniqueSymptoms7) : "--"}
						delta={
							uniqueSymptomsPrior7 || uniqueSymptoms7
								? deltaText(uniqueSymptomsPrior7, uniqueSymptoms7)
								: null
						}
						deltaGood={isImprovement(uniqueSymptomsPrior7, uniqueSymptoms7, true)}
					/>
					<StatCard
						label="Best score · 7d"
						value={bestScore7 !== null ? String(bestScore7) : "--"}
						delta={null}
						deltaGood={null}
					/>
				</section>

				{/* Trend chart */}
				<section className="mb-8 animate-fade-up-delay-4">
					<TrendChart points={points} onLog={() => setShowLog(true)} />
				</section>

				</>
				)}

				<section className={activeTab === "timeline" ? "rounded-3xl card" : "rounded-3xl card animate-fade-up"}>
					{activeTab === "timeline" && (
						<HealthTimeline entries={entries} onLog={() => setShowLog(true)} />
					)}
					{activeTab === "insights" && <AIInsights entries={entries} />}
					{activeTab === "report" && <DoctorReport entries={entries} />}
				</section>
			</div>

			{/* Log entry modal */}
			{showWelcome && <WelcomeModal onClose={() => setShowWelcome(false)} />}

			{showLog && (
				<div
					className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center overflow-y-auto p-4 sm:p-8"
					onClick={() => setShowLog(false)}
				>
					<div
						className="w-full max-w-2xl rounded-2xl card my-4 animate-fade-up"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="flex items-center justify-between px-6 pt-5">
							<h2 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-mist">
								Log entry
							</h2>
							<button
								onClick={() => setShowLog(false)}
								className="p-1.5 rounded-full text-mist hover:text-snow hover:bg-panel-2 transition-colors"
								aria-label="Close"
							>
								<X className="h-5 w-5" />
							</button>
						</div>
						<SymptomEntryForm
							onEntryAdded={() => {
								setShowLog(false);
								loadEntries();
							}}
						/>
					</div>
				</div>
			)}
			</SidebarInset>
		</SidebarProvider>
	);
}

/* ----------------------------- helpers ---------------------------------- */

function deltaText(
	before: number | null,
	after: number | null
): string | null {
	if (before === null || after === null) return null;
	const diff = after - before;
	if (Math.abs(diff) < 0.05) return "—";
	const rounded = Math.abs(Math.round(diff * 10) / 10);
	const display = Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
	return `${diff > 0 ? "▲" : "▼"} ${display}`;
}

function isImprovement(
	before: number | null,
	after: number | null,
	lowerIsBetter: boolean
): boolean | null {
	if (before === null || after === null) return null;
	const diff = after - before;
	if (Math.abs(diff) < 0.05) return null;
	return lowerIsBetter ? diff < 0 : diff > 0;
}

function Contributor({
	label,
	display,
	fraction,
	delta,
	deltaGood,
}: {
	label: string;
	display: string;
	fraction: number | null; // 0–1, null = no data
	delta: string | null;
	deltaGood: boolean | null;
}) {
	const color =
		fraction === null
			? "#e4e4e7"
			: BAND_COLOR[bandForScore(Math.round(fraction * 100))];
	return (
		<div>
			<div className="flex items-baseline justify-between mb-1.5">
				<span className="text-sm text-mist">{label}</span>
				<span className="flex items-baseline gap-2">
					{delta && (
						<span
							className={`text-xs tnum ${
								deltaGood === null
									? "text-faint"
									: deltaGood
									? "text-good"
									: "text-bad"
							}`}
						>
							{delta}
						</span>
					)}
					<span className="text-sm tnum text-snow">{display}</span>
				</span>
			</div>
			<div className="h-1 rounded-full bg-edge overflow-hidden">
				<div
					className="h-full rounded-full transition-all duration-700"
					style={{
						width: `${Math.round((fraction ?? 0) * 100)}%`,
						background: color,
					}}
				/>
			</div>
		</div>
	);
}

function StatCard({
	label,
	value,
	delta,
	deltaGood,
}: {
	label: string;
	value: string;
	delta: string | null;
	deltaGood: boolean | null;
}) {
	return (
		<div className="rounded-2xl card card-lift px-5 py-4">
			<p className="text-[11px] font-medium uppercase tracking-[0.15em] text-faint mb-2">
				{label}
			</p>
			<div className="flex items-baseline gap-2">
				<span className="font-display text-3xl font-extralight tnum">
					{value}
				</span>
				{delta && (
					<span
						className={`text-xs tnum ${
							deltaGood === null
								? "text-faint"
								: deltaGood
								? "text-good"
								: "text-bad"
						}`}
					>
						{delta}
					</span>
				)}
			</div>
		</div>
	);
}
