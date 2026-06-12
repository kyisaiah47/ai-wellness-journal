export default function Logo({ className = "h-5 w-5" }: { className?: string }) {
	return (
		<svg viewBox="20 20 53 53" fill="currentColor" className={className} aria-hidden="true">
			<FlowPaths />
		</svg>
	);
}

/* The actual Flow mark from the brand sheet (Figma export). */
function FlowPaths() {
	return (
		<>
			<path d="M37.7 40.9C44.6 37.6 50 32 53.1 25C51.1 22.9 48.5 21.4 45.7 20.5L44.2 20C44.1 20.2 44 20.5 44 20.7C41.6 27.5 36.7 33 30.1 36.1C25.5 38.3 22.1 42.3 20.5 47.1L20 48.6C20.2 48.7 20.5 48.8 20.7 48.8C22.6 49.5 24.5 50.4 26.3 51.5C28.8 47 32.8 43.2 37.7 40.9Z" />
			<path d="M66.7 41.3C63 46.9 57.9 51.4 51.6 54.4C46.5 56.8 42.6 61.3 40.8 66.7L40.3 68.4C42.2 70.1 44.5 71.4 47 72.2L48.5 72.7C48.6 72.5 48.7 72.2 48.7 72C51.1 65.2 56 59.7 62.6 56.6C67.2 54.4 70.7 50.4 72.2 45.6L72.7 44.1C70.6 43.5 68.6 42.5 66.7 41.3Z" />
			<path d="M36.3 63.2C38.8 57.2 43.4 52.3 49.3 49.5C54.7 46.9 59.2 42.9 62.3 38C60 35.8 58.1 33.3 56.7 30.3C53 37.1 47.2 42.6 40.1 46C36 47.9 32.7 51.2 30.7 55.2C32.9 57.3 34.7 59.9 36.1 62.8C36.1 62.8 36.2 63 36.3 63.2Z" />
		</>
	);
}

/**
 * Oversized, low-opacity Flow marks drifting behind a section.
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
			<svg
				viewBox="20 20 53 53"
				fill="currentColor"
				className={`absolute -left-24 -top-24 h-[420px] w-[420px] -rotate-12 animate-wave-drift ${className}`}
			>
				<FlowPaths />
			</svg>
			<svg
				viewBox="20 20 53 53"
				fill="currentColor"
				className={`absolute -right-16 -bottom-28 h-[340px] w-[340px] rotate-6 animate-wave-drift ${className}`}
			>
				<FlowPaths />
			</svg>
		</div>
	);
}

/** Tiny Flow mark flanked by hairlines — a quiet section divider. */
export function WaveDivider({ className = "" }: { className?: string }) {
	return (
		<div
			className={`flex items-center justify-center gap-4 ${className}`}
			aria-hidden="true"
		>
			<span className="h-px w-16 bg-gradient-to-r from-transparent to-edge" />
			<svg viewBox="20 20 53 53" fill="currentColor" className="h-4 w-4 text-good/40">
				<FlowPaths />
			</svg>
			<span className="h-px w-16 bg-gradient-to-l from-transparent to-edge" />
		</div>
	);
}
