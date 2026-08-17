"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            router.replace("/tasks");
        } else {
            router.replace("/login");
        }
    }, [router]);

    return (
        <main className="center-page">
            <div className="loading-spinner" />
            <p>Loading...</p>
        </main>
    );
}