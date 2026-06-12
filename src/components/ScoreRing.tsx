"use client";

import { bandForScore, BAND_COLOR } from "@/lib/score";

interface Props {
	score: number | null; // 0–100, null = no log yet
	size?: number;
	label?: string;
}

/**
 * Whoop-style hero dial: a single round-capped arc on a dark track,
 * big light numeral in the middle, small-caps label underneath.
 */
export default function ScoreRing({ score, size = 240, label = "Wellness" }: Props) {
	const stroke = Math.round(size * 0.055);
	const r = (size - stroke) / 2;
	const c = 2 * Math.PI * r;
	// Leave a gap at the bottom like a gauge (300° sweep).
	const sweep = 300 / 360;
	const trackLen = c * sweep;
	const value = score ?? 0;
	const fillLen = trackLen * (value / 100);
	const color = score === null ? "#5b6770" : BAND_COLOR[bandForScore(score)];

	return (
		<div
			className="relative inline-flex items-center justify-center"
			style={{ width: size, height: size }}
		>
			<svg
				width={size}
				height={size}
				viewBox={`0 0 ${size} ${size}`}
				// Rotate so the gap sits at the bottom center.
				style={{ transform: "rotate(120deg)" }}
				aria-hidden
			>
				<circle
					cx={size / 2}
					cy={size / 2}
					r={r}
					fill="none"
					stroke="#1c242c"
					strokeWidth={stroke}
					strokeLinecap="round"
					strokeDasharray={`${trackLen} ${c}`}
				/>
				{score !== null && score > 0 && (
					<circle
						cx={size / 2}
						cy={size / 2}
						r={r}
						fill="none"
						stroke={color}
						strokeWidth={stroke}
						strokeLinecap="round"
						strokeDasharray={`${fillLen} ${c}`}
						style={{ transition: "stroke-dasharray 0.8s ease, stroke 0.3s ease" }}
					/>
				)}
			</svg>
			<div className="absolute inset-0 flex flex-col items-center justify-center">
				<span
					className="tnum font-extralight leading-none"
					style={{ fontSize: size * 0.3, color: score === null ? "#5b6770" : "#e6edf3" }}
				>
					{score === null ? "--" : value}
				</span>
				<span className="mt-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-mist">
					{label}
				</span>
			</div>
		</div>
	);
}
