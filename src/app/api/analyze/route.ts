import { NextRequest, NextResponse } from "next/server";
import { analyzeSymptoms, generateHealthInsights } from "@/lib/claude";
import type { WellnessEntry } from "@/lib/types";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const entries = body?.entries as WellnessEntry[] | undefined;
		const action = (body?.action as string) || "analyze";

		if (!entries || !Array.isArray(entries) || entries.length === 0) {
			return NextResponse.json(
				{ error: "Invalid entries data" },
				{ status: 400 }
			);
		}

		if (action === "insights") {
			const insights = await generateHealthInsights(entries);
			return NextResponse.json({ insights });
		}

		const analysis = await analyzeSymptoms(entries);
		return NextResponse.json(analysis);
	} catch (error) {
		console.error("Analysis API Error:", error);
		return NextResponse.json(
			{ error: "Failed to analyze symptoms" },
			{ status: 500 }
		);
	}
}

export async function GET() {
	return NextResponse.json({
		message: "AI Symptom Analysis API",
		endpoints: {
			"POST /api/analyze":
				'Analyze symptom entries. Body: { entries, action?: "analyze" | "insights" }',
		},
	});
}
