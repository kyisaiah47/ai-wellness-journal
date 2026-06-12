"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import AuthScreen from "@/components/AuthScreen";

export default function LoginPage() {
	const router = useRouter();

	useEffect(() => {
		supabase.auth.getSession().then(({ data }) => {
			if (data.session) router.replace("/");
		});
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			if (session) router.replace("/");
		});
		return () => subscription.unsubscribe();
	}, [router]);

	return <AuthScreen />;
}
