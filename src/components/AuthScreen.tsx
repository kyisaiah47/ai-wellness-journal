"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type Mode = "signin" | "signup";

export default function AuthScreen() {
	const [mode, setMode] = useState<Mode>("signin");
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
					setNotice("Check your inbox — confirm your email, then sign in.");
				}
			} else {
				const { error } = await supabase.auth.signInWithPassword({
					email,
					password,
				});
				if (error) throw error;
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Something went wrong.");
		} finally {
			setBusy(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center px-4">
			<div className="w-full max-w-sm">
				<div className="flex items-center justify-center gap-2 mb-8">
					<span className="h-2 w-2 rounded-full bg-good" />
					<span className="text-sm font-semibold tracking-[0.18em] uppercase">
						Charted
					</span>
				</div>

				<div className="rounded-2xl bg-panel border border-edge p-6">
					<h1 className="text-lg font-semibold text-snow mb-1">
						{mode === "signin" ? "Welcome back" : "Create your journal"}
					</h1>
					<p className="text-sm text-mist mb-6">
						{mode === "signin"
							? "Sign in to see your trends."
							: "Your entries are private to your account."}
					</p>

					<form onSubmit={submit} className="space-y-3">
						<input
							type="email"
							required
							autoComplete="email"
							placeholder="Email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full px-3.5 py-2.5 rounded-xl bg-ink border border-edge text-sm text-snow placeholder:text-faint focus:outline-none focus:border-mist"
						/>
						<input
							type="password"
							required
							minLength={6}
							autoComplete={
								mode === "signin" ? "current-password" : "new-password"
							}
							placeholder="Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full px-3.5 py-2.5 rounded-xl bg-ink border border-edge text-sm text-snow placeholder:text-faint focus:outline-none focus:border-mist"
						/>

						{error && <p className="text-xs text-bad">{error}</p>}
						{notice && <p className="text-xs text-good">{notice}</p>}

						<button
							type="submit"
							disabled={busy}
							className="w-full py-2.5 rounded-full bg-good text-ink text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
						>
							{busy
								? "One moment…"
								: mode === "signin"
								? "Sign in"
								: "Create account"}
						</button>
					</form>

					<button
						onClick={() => {
							setMode(mode === "signin" ? "signup" : "signin");
							setError(null);
							setNotice(null);
						}}
						className="mt-4 w-full text-center text-xs text-mist hover:text-snow transition-colors"
					>
						{mode === "signin"
							? "New here? Create an account"
							: "Already have an account? Sign in"}
					</button>
				</div>
			</div>
		</div>
	);
}
