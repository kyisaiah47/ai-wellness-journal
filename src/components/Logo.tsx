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
