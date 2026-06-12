import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Table names. The Supabase project is shared with another production app,
// so everything belonging to this app is prefixed with `wellness_`.
export const ENTRIES_TABLE = "wellness_entries";
export const REPORTS_TABLE = "wellness_reports";

export type { WellnessEntry, SymptomAnalysis } from "@/lib/types";

export interface WellnessReport {
	id: string;
	user_id: string;
	period_start: string;
	period_end: string;
	analysis: Record<string, unknown>;
	created_at: string;
}
