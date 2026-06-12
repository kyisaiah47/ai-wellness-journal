import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
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
				{children}
			</body>
		</html>
	);
}
