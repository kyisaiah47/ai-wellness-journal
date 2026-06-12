"use client";

import { PlusIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function SiteHeader({
	demo,
	onLog,
}: {
	demo: boolean;
	onLog: () => void;
}) {
	return (
		<header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
			<div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
				<SidebarTrigger className="-ml-1" />
				<Separator
					orientation="vertical"
					className="mx-2 h-4 data-vertical:self-auto"
				/>
				<h1 className="text-base font-medium">
					{demo ? "Sample journal" : "Your journal"}
				</h1>
				<div className="ml-auto">
					<button
						onClick={onLog}
						className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-spark text-white text-sm font-semibold hover:opacity-90 transition-opacity"
					>
						<PlusIcon className="h-4 w-4" strokeWidth={2.5} />
						{demo ? "Start yours" : "Log entry"}
					</button>
				</div>
			</div>
		</header>
	);
}
