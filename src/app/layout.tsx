import type { Metadata } from "next";
import Link from "next/link";
import { Inter, Sora } from "next/font/google";
import { WaveDivider } from "@/components/Logo";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora" });

export const metadata: Metadata = {
	title: "Charted — Daily Wellness Tracking",
	description:
		"Log daily symptoms, watch your wellness score, and generate AI-assisted summaries and doctor-ready reports.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className={`${inter.variable} ${sora.variable}`}>
			<body className="min-h-screen bg-ink text-snow antialiased">
				<main>{children}</main>

				<footer className="mt-16">
					<WaveDivider className="mb-0" />
					<div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-4">
						<p className="text-xs leading-relaxed text-faint max-w-3xl">
							<span className="font-semibold text-mist">
								Not medical advice.
							</span>{" "}
							Charted is a personal symptom log. Scores, insights, and
							reports are generated from your own entries for informational
							purposes only — they are not a diagnosis and are no substitute
							for professional medical examination or advice. If you are
							concerned about your health, talk to a doctor. In an emergency,
							call your local emergency number.
						</p>
						<div className="flex items-center gap-5 text-xs text-faint">
							<span>© {new Date().getFullYear()} Charted</span>
							<Link
								href="/privacy"
								className="hover:text-snow transition-colors underline underline-offset-2"
							>
								Privacy
							</Link>
							<a
								href="mailto:kyisaiah47@gmail.com"
								className="hover:text-snow transition-colors underline underline-offset-2"
							>
								Contact
							</a>
						</div>
					</div>
				</footer>
			</body>
		</html>
	);
}
