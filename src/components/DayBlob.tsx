import type { ScoreBand } from "@/lib/score";

const BLOB_FILL: Record<ScoreBand | "none", string> = {
	good: "#2f8a5e",
	neutral: "#d97e2f",
	bad: "#bd5a46",
	none: "#d8c8b4",
};

/* Headspace-style companion: a soft blob whose face follows the day. */
export default function DayBlob({
	band,
	className = "h-28 w-28",
}: {
	band: ScoreBand | "none";
	className?: string;
}) {
	return (
		<svg viewBox="0 0 120 120" className={className} aria-hidden="true">
			<path
				d="M60 6c30 0 54 21 54 52s-22 56-54 56S6 91 6 58 30 6 60 6Z"
				fill={BLOB_FILL[band]}
			/>
			{band === "good" && (
				<g stroke="#1f3528" strokeWidth="5" strokeLinecap="round" fill="none">
					<path d="M38 52c4-6 12-6 16 0" />
					<path d="M66 52c4-6 12-6 16 0" />
					<path d="M40 74c8 10 32 10 40 0" />
				</g>
			)}
			{band === "neutral" && (
				<g stroke="#3d2a17" strokeWidth="5" strokeLinecap="round" fill="none">
					<path d="M38 52c4-6 12-6 16 0" />
					<path d="M66 52c4-6 12-6 16 0" />
					<path d="M44 76h32" />
				</g>
			)}
			{band === "bad" && (
				<g stroke="#3a201a" strokeWidth="5" strokeLinecap="round" fill="none">
					<path d="M38 54c4-6 12-6 16 0" />
					<path d="M66 54c4-6 12-6 16 0" />
					<path d="M42 80c8-8 28-8 36 0" />
				</g>
			)}
			{band === "none" && (
				<g stroke="#7a6a55" strokeWidth="5" strokeLinecap="round" fill="none">
					<circle cx="46" cy="54" r="2.5" fill="#7a6a55" stroke="none" />
					<circle cx="74" cy="54" r="2.5" fill="#7a6a55" stroke="none" />
					<path d="M48 76c6 5 18 5 24 0" />
				</g>
			)}
		</svg>
	);
}
