"use client";

import * as React from "react";
import {
	LayoutDashboardIcon,
	CalendarDaysIcon,
	SparklesIcon,
	FileTextIcon,
	ShieldIcon,
	LogOutIcon,
	PlusIcon,
} from "lucide-react";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import Logo from "@/components/Logo";

export type Section = "overview" | "timeline" | "insights" | "report";

const SECTIONS: { id: Section; title: string; icon: React.ReactNode }[] = [
	{ id: "overview", title: "Overview", icon: <LayoutDashboardIcon /> },
	{ id: "timeline", title: "Timeline", icon: <CalendarDaysIcon /> },
	{ id: "insights", title: "Insights", icon: <SparklesIcon /> },
	{ id: "report", title: "Doctor report", icon: <FileTextIcon /> },
];

export function AppSidebar({
	active,
	onSectionSelect,
	demo,
	onLog,
	onSignOut,
	...props
}: React.ComponentProps<typeof Sidebar> & {
	active: Section;
	onSectionSelect: (s: Section) => void;
	demo: boolean;
	onLog: () => void;
	onSignOut: () => void;
}) {
	return (
		<Sidebar collapsible="offcanvas" {...props}>
			<SidebarHeader>
				<div className="flex items-center gap-2 px-2 py-1.5">
					<Logo className="h-5 w-5 text-white" />
					<span className="font-display text-base font-bold tracking-tight">
						Charted
					</span>
				</div>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton
									onClick={onLog}
									className="bg-[#3d3c3c] text-white font-semibold hover:bg-[#3d3c3c]/90 hover:text-white justify-center mb-2"
								>
									<PlusIcon />
									<span>{demo ? "Start your journal" : "How was today?"}</span>
								</SidebarMenuButton>
							</SidebarMenuItem>
							{SECTIONS.map((s) => (
								<SidebarMenuItem key={s.id}>
									<SidebarMenuButton
										tooltip={s.title}
										isActive={active === s.id}
										onClick={() => onSectionSelect(s.id)}
									>
										{s.icon}
										<span>{s.title}</span>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
				<SidebarGroup className="mt-auto">
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton render={<a href="/privacy" />}>
									<ShieldIcon />
									<span>Privacy</span>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				{!demo && (
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton onClick={onSignOut}>
								<LogOutIcon />
								<span>Sign out</span>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				)}
			</SidebarFooter>
		</Sidebar>
	);
}
