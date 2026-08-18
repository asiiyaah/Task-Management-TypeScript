"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "../lib/api";

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                await getCurrentUser();

                if (!mounted) return;

                router.replace("/tasks");
            } catch {
                router.replace("/login");
            }
        })();

        return () => {
            mounted = false;
        };
    }, [router]);

    return (
        <main className="center-page">
            <div className="loading-spinner" />
            <p>Loading...</p>
        </main>
    );
}