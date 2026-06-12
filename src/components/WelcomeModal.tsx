"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Logo from "@/components/Logo";

const STORY: Array<{ eyebrow: string; heading: string; body: string; cta: string }> = [
	{
		eyebrow: "Sound familiar?",
		heading: "“It’s been happening for a while.”",
		body: "— you, at every appointment. How long exactly? Which days? After what? Nobody remembers. That’s how patterns hide for years.",
		cta: "There’s a better way →",
	},
	{
		eyebrow: "30 seconds a day",
		heading: "You log how you feel. Charted does the remembering.",
		body: "Pick your symptoms, rate the day, jot a note. You get a daily score, trends over weeks, AI that points out what repeats — and a doctor-ready report for your next visit.",
		cta: "Start your journal →",
	},
];

export default function WelcomeModal({ onClose }: { onClose: () => void }) {
	const [step, setStep] = useState(0);
	const [mode, setMode] = useState<"signup" | "signin">("signup");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [notice, setNotice] = useState<string | null>(null);

	const submit = async (e: React.FormEvent) => {
		e.preventDefault();
		setBusy(true);
		setError(null);
		setNotice(null);
		try {
			if (mode === "signup") {
				const { data, error } = await supabase.auth.signUp({ email, password });
				if (error) throw error;
				if (!data.session) {
					setNotice("Check your inbox — confirm your email, then sign in here.");
					setMode("signin");
				}
			} else {
				const { error } = await supabase.auth.signInWithPassword({ email, password });
				if (error) throw error;
				onClose();
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Something went wrong.");
		} finally {
			setBusy(false);
		}
	};

	const story = step < STORY.length ? STORY[step] : null;

	return (
		<div className="fixed inset-0 z-50 bg-snow/20 backdrop-blur-sm flex items-center justify-center p-4">
			<div className="relative w-full max-w-md rounded-2xl card p-8 animate-fade-up">
				<button
					onClick={onClose}
					className="absolute right-4 top-4 p-1.5 rounded-full text-faint hover:text-snow hover:bg-panel-2 transition-colors"
					aria-label="Close"
				>
					<X className="h-4 w-4" />
				</button>

				<div className="flex items-center gap-2 mb-6">
					<Logo className="h-5 w-5 text-good" />
					<span className="text-sm font-semibold tracking-tight">Charted</span>
				</div>

				{story ? (
					<>
						<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-good mb-3">
							{story.eyebrow}
						</p>
						<h2 className="font-display text-2xl font-semibold leading-snug mb-3">
							{story.heading}
						</h2>
						<p className="text-sm text-mist leading-relaxed mb-8">{story.body}</p>
						<div className="flex items-center justify-between">
							<div className="flex gap-1.5">
								{[...STORY, null].map((_, i) => (
									<span
										key={i}
										className={`h-1.5 w-1.5 rounded-full ${
											i === step ? "bg-snow" : "bg-edge"
										}`}
									/>
								))}
							</div>
							<button
								onClick={() => setStep(step + 1)}
								className="px-4 py-2 rounded-full bg-snow text-ink text-sm font-semibold hover:opacity-90 transition-opacity"
							>
								{story.cta}
							</button>
						</div>
					</>
				) : (
					<>
						<h2 className="font-display text-2xl font-semibold leading-snug mb-1">
							{mode === "signup" ? "Start your journal" : "Welcome back"}
						</h2>
						<p className="text-sm text-mist mb-6">
							{mode === "signup"
								? "Free. Private to your account."
								: "Sign in to see your trends."}
						</p>
						<form onSubmit={submit} className="space-y-3">
							<input
								type="email"
								required
								autoComplete="email"
								placeholder="Email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="w-full px-3.5 py-2.5 rounded-xl bg-panel border border-edge text-sm placeholder:text-faint focus:outline-none focus:border-good"
							/>
							<input
								type="password"
								required
								minLength={6}
								autoComplete={mode === "signin" ? "current-password" : "new-password"}
								placeholder="Password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="w-full px-3.5 py-2.5 rounded-xl bg-panel border border-edge text-sm placeholder:text-faint focus:outline-none focus:border-good"
							/>
							{error && <p className="text-xs text-bad">{error}</p>}
							{notice && <p className="text-xs text-good">{notice}</p>}
							<button
								type="submit"
								disabled={busy}
								className="w-full py-2.5 rounded-full bg-snow text-ink text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
							>
								{busy ? "One moment…" : mode === "signup" ? "Create account" : "Sign in"}
							</button>
						</form>
						<button
							onClick={() => {
								setMode(mode === "signup" ? "signin" : "signup");
								setError(null);
							}}
							className="mt-4 w-full text-center text-xs text-mist hover:text-snow transition-colors"
						>
							{mode === "signup"
								? "Already have an account? Sign in"
								: "New here? Create an account"}
						</button>
					</>
				)}
			</div>
		</div>
	);
}
