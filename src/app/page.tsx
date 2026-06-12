"use client";

import { useState, useEffect } from "react";
import { Plus, Calendar, TrendingUp, FileText, Brain } from "lucide-react";
import { supabase, ENTRIES_TABLE } from "@/lib/supabase";
import type { WellnessEntry } from "@/lib/types";
import SymptomEntryForm from "@/components/SymptomEntryForm";
import HealthTimeline from "@/components/HealthTimeline";
import AIInsights from "@/components/AIInsights";
import DoctorReport from "@/components/DoctorReport";

export default function Dashboard() {
	const [entries, setEntries] = useState<WellnessEntry[]>([]);
	const [activeTab, setActiveTab] = useState<
		"log" | "timeline" | "insights" | "report"
	>("log");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		loadEntries();
	}, []);

	const loadEntries = async () => {
		try {
			const { data, error } = await supabase
				.from(ENTRIES_TABLE)
				.select("*")
				.order("date", { ascending: false });

			if (error) throw error;
			setEntries(data || []);
		} catch (error) {
			console.error("Error loading entries:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleEntryAdded = () => {
		loadEntries();
	};

	const tabs = [
		{ id: "log", label: "Log Symptoms", icon: Plus },
		{ id: "timeline", label: "Timeline", icon: Calendar },
		{ id: "insights", label: "AI Insights", icon: Brain },
		{ id: "report", label: "Doctor Report", icon: FileText },
	];

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
			</div>
		);
	}

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
			{/* Header */}
			<div className="mb-10">
				<h1 className="text-3xl font-extrabold text-amber-900 mb-2 flex items-center gap-2">
					<Brain className="h-8 w-8 text-orange-500" />
					Wellness Journal Dashboard
				</h1>
				<p className="mt-2 text-lg text-amber-700">
					Track your symptoms and gentle wellness insights for mindful health
					management.
				</p>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
				<div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-2xl shadow-xl p-8 border border-amber-200">
					<div className="flex items-center gap-4">
						<Calendar className="h-10 w-10 text-amber-700" />
						<div>
							<p className="text-base font-semibold text-amber-700 mb-1">
								Total Entries
							</p>
							<p className="text-4xl font-extrabold text-amber-900">
								{entries.length}
							</p>
						</div>
					</div>
				</div>

				<div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl shadow-xl p-8 border border-green-200">
					<div className="flex items-center gap-4">
						<TrendingUp className="h-10 w-10 text-emerald-700" />
						<div>
							<p className="text-base font-semibold text-emerald-700 mb-1">
								This Week
							</p>
							<p className="text-4xl font-extrabold text-emerald-900">
								{
									entries.filter((entry) => {
										const entryDate = new Date(entry.date);
										const weekAgo = new Date();
										weekAgo.setDate(weekAgo.getDate() - 7);
										return entryDate >= weekAgo;
									}).length
								}
							</p>
						</div>
					</div>
				</div>

				<div className="bg-gradient-to-br from-orange-50 to-red-100 rounded-2xl shadow-xl p-8 border border-orange-200">
					<div className="flex items-center gap-4">
						<Brain className="h-10 w-10 text-orange-700" />
						<div>
							<p className="text-base font-semibold text-orange-700 mb-1">
								AI Analyses
							</p>
							<p className="text-4xl font-extrabold text-orange-900">
								{entries.filter((entry) => entry.ai_summary).length}
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Tab Navigation */}
			<div className="border-b-2 border-amber-200 mb-10">
				<nav className="-mb-px flex space-x-6">
					{tabs.map((tab) => {
						const Icon = tab.icon;
						return (
							<button
								key={tab.id}
								onClick={() => setActiveTab(tab.id as typeof activeTab)}
								className={`py-3 px-4 border-b-4 font-semibold text-base flex items-center gap-2 transition-all focus:outline-none focus:ring-2 focus:ring-orange-300 rounded-t-xl shadow-sm ${
									activeTab === tab.id
										? "border-orange-500 text-orange-900 bg-orange-50"
										: "border-transparent text-amber-600 hover:text-orange-700 hover:border-orange-300"
								}`}
							>
								<Icon className="h-5 w-5" />
								<span>{tab.label}</span>
							</button>
						);
					})}
				</nav>
			</div>

			{/* Tab Content */}
			<div
				className="bg-gradient-to-br from-amber-25 to-orange-25 rounded-2xl shadow-2xl min-h-[600px] border border-amber-200 p-8 flex flex-col justify-center"
				style={{
					background: "linear-gradient(135deg, #fefdf9 0%, #fef7ed 100%)",
					backgroundImage: `
					   url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23d4b896' fill-opacity='0.05' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")
				   `,
				}}
			>
				{activeTab === "log" && (
					<SymptomEntryForm onEntryAdded={handleEntryAdded} />
				)}
				{activeTab === "timeline" && <HealthTimeline entries={entries} />}
				{activeTab === "insights" && <AIInsights entries={entries} />}
				{activeTab === "report" && <DoctorReport entries={entries} />}
			</div>
		</div>
	);
}
