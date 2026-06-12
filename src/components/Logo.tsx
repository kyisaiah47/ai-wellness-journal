export default function Logo({ className = "h-5 w-5" }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2.4"
			strokeLinecap="round"
			className={className}
			aria-hidden="true"
		>
			<path d="M8 6c2-2.2 4.5-2.2 6.5 0s4 2.2 5.5.5" />
			<path d="M5.5 12c2-2.2 4.5-2.2 6.5 0s4 2.2 5.5.5" />
			<path d="M3 18c2-2.2 4.5-2.2 6.5 0s4 2.2 5.5.5" />
		</svg>
	);
}

/**
 * Oversized, low-opacity Flow waves that drift behind a section.
 * Parent must be `relative`; content above should be `relative z-10`.
 */
export function WaveBackdrop({
	className = "text-good/[0.05]",
}: {
	className?: string;
}) {
	return (
		<div
			className="pointer-events-none absolute inset-0 overflow-hidden"
			aria-hidden="true"
		>
			<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
				<svg
					viewBox="0 0 1200 480"
					fill="none"
					stroke="currentColor"
					strokeWidth="3"
					strokeLinecap="round"
					className={`w-[1500px] max-w-none animate-wave-drift ${className}`}
				>
					<path d="M-40 140 C 140 60, 320 60, 500 140 S 860 220, 1040 140 S 1280 80, 1340 110" />
					<path d="M-80 250 C 100 170, 280 170, 460 250 S 820 330, 1000 250 S 1260 190, 1320 220" />
					<path d="M-120 360 C 60 280, 240 280, 420 360 S 780 440, 960 360 S 1220 300, 1280 330" />
				</svg>
			</div>
		</div>
	);
}

/** Tiny Flow wave flanked by hairlines — a quiet section divider. */
export function WaveDivider({ className = "" }: { className?: string }) {
	return (
		<div
			className={`flex items-center justify-center gap-4 ${className}`}
			aria-hidden="true"
		>
			<span className="h-px w-16 bg-gradient-to-r from-transparent to-edge" />
			<svg
				viewBox="0 0 44 12"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				className="h-3 w-11 text-good/40"
			>
				<path d="M2 7c3.3-3.7 6.7-3.7 10 0s6.7 3.7 10 0 6.7-3.7 10 0 6.7 3.7 10 0" />
			</svg>
			<span className="h-px w-16 bg-gradient-to-l from-transparent to-edge" />
		</div>
	);
}
