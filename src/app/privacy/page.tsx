import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Privacy — Pulse Journal",
	description: "What Pulse Journal stores, how it's processed, and your rights.",
};

export default function PrivacyPage() {
	return (
		<div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
			<Link
				href="/"
				className="text-sm text-mist hover:text-snow transition-colors"
			>
				← Back to dashboard
			</Link>

			<h1 className="mt-6 mb-2 text-2xl font-semibold">Privacy policy</h1>
			<p className="text-sm text-faint mb-10">Last updated June 12, 2026</p>

			<div className="space-y-8 text-sm leading-relaxed text-mist">
				<section>
					<h2 className="text-snow font-semibold mb-2">What we store</h2>
					<p>
						When you log an entry, we store the date, the symptoms you
						selected, your severity rating, and any notes you write. Generated
						doctor reports may also be saved so you can revisit them. This data
						lives in a Supabase (PostgreSQL) database and is scoped to your
						account — row-level security ensures only you can read or change
						your own entries.
					</p>
				</section>

				<section>
					<h2 className="text-snow font-semibold mb-2">AI processing</h2>
					<p>
						When you request insights or a doctor report, the relevant entries
						(date, symptoms, severity, notes) are sent to Anthropic&apos;s API
						to generate the summary. Only the entries needed for that request
						are sent, and only when you explicitly ask for an analysis —
						nothing is analyzed in the background.
					</p>
				</section>

				<section>
					<h2 className="text-snow font-semibold mb-2">
						What we don&apos;t do
					</h2>
					<p>
						We do not sell your data. We do not share it with advertisers or
						any third party beyond the infrastructure named above (Supabase for
						storage, Anthropic for on-demand analysis). There is no analytics
						or ad tracking in the app.
					</p>
				</section>

				<section>
					<h2 className="text-snow font-semibold mb-2">Your data, your call</h2>
					<p>
						You can ask for a copy of your data or for full deletion at any
						time — email{" "}
						<a
							href="mailto:kyisaiah47@gmail.com"
							className="text-good hover:underline underline-offset-2"
						>
							kyisaiah47@gmail.com
						</a>{" "}
						and it will be handled promptly.
					</p>
				</section>

				<section>
					<h2 className="text-snow font-semibold mb-2">Not medical advice</h2>
					<p>
						Pulse Journal is a personal logging tool. Scores, insights, and
						reports are informational only and are not medical advice,
						diagnosis, or treatment. Always consult a healthcare professional
						about your health.
					</p>
				</section>

				<section>
					<h2 className="text-snow font-semibold mb-2">Contact</h2>
					<p>
						Questions about this policy:{" "}
						<a
							href="mailto:kyisaiah47@gmail.com"
							className="text-good hover:underline underline-offset-2"
						>
							kyisaiah47@gmail.com
						</a>
					</p>
				</section>
			</div>
		</div>
	);
}
