"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Logo, { WaveBackdrop, WaveDivider } from "@/components/Logo";
import ScoreRing from "@/components/ScoreRing";

const FEATURES = [
	{
		title: "Log in 30 seconds",
		body: "Pick your symptoms, rate the day, add a note. No wearable required — you are the sensor.",
	},
	{
		title: "See what repeats",
		body: "A daily score, trend lines, and week-over-week deltas turn scattered bad days into visible patterns.",
	},
	{
		title: "Walk in prepared",
		body: "A structured, doctor-ready report of your history — so the appointment starts at the answer, not the recap.",
	},
];

export default function Landing() {
	return (
		<div className="min-h-screen flex flex-col">
			{/* Top bar */}
			<header className="sticky top-0 z-40 bg-ink/90 backdrop-blur border-b border-edge">
				<div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Logo className="h-5 w-5 text-good" />
						<span className="text-sm font-semibold tracking-[0.18em] uppercase">
							Charted
						</span>
					</div>
					<Link
						href="/login"
						className="px-3.5 py-1.5 rounded-full text-sm font-medium text-mist hover:text-snow border border-edge hover:bg-panel transition-colors"
					>
						Sign in
					</Link>
				</div>
			</header>

			<main className="flex-1">
				{/* Hero */}
				<section className="relative">
					<WaveBackdrop className="text-good/[0.05]" />
					<div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-16 pb-12 grid lg:grid-cols-2 gap-10 items-center">
						<div>
							<h1 className="font-display text-4xl sm:text-5xl font-extralight leading-[1.1] text-snow animate-fade-up">
								Your symptoms have a pattern.
								<br />
								<span className="font-semibold">Chart it.</span>
							</h1>
							<p className="mt-5 text-base text-mist max-w-md leading-relaxed animate-fade-up-delay-1">
								Charted is a daily symptom journal that scores how you feel,
								charts the trend, and turns months of vague bad days into a
								report your doctor can actually use.
							</p>
							<div className="mt-8 flex items-center gap-4 animate-fade-up-delay-2">
								<Link
									href="/login"
									className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-good text-ink text-sm font-semibold hover:opacity-90 transition-opacity"
								>
									Start your journal
									<ArrowRight className="h-4 w-4" />
								</Link>
								<span className="text-xs text-faint">Free · private to you</span>
							</div>
						</div>

						<div className="relative rounded-2xl card px-6 py-10 flex flex-col items-center overflow-hidden animate-fade-up-delay-2">
							<div className="score-glow absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2" />
							<div className="relative flex flex-col items-center">
								<ScoreRing score={82} />
								<p className="mt-1 text-sm font-semibold text-good">Steady</p>
								<p className="mt-1 text-xs text-faint">
									Today&apos;s wellness score
								</p>
							</div>
						</div>
					</div>
				</section>

				<WaveDivider className="mb-12 animate-fade-up-delay-3" />

				{/* Feature rows */}
				<section className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
					<div className="grid sm:grid-cols-3 gap-4">
						{FEATURES.map((f, i) => (
							<div
								key={f.title}
								className={`rounded-2xl card card-lift px-5 py-6 animate-fade-up-delay-${Math.min(
									i + 2,
									4
								)}`}
							>
								<h3 className="font-display text-sm font-semibold text-snow mb-2">
									{f.title}
								</h3>
								<p className="text-sm text-mist leading-relaxed">{f.body}</p>
							</div>
						))}
					</div>
				</section>
			</main>
		</div>
	);
}
