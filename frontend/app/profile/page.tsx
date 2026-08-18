"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, logout as logoutUser } from "../../lib/api";

type User = {
    id: string;
    name: string;
    email: string;
    role: "admin" | "user";
};

export default function ProfilePage() {

    const router = useRouter();

    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                const data = await getCurrentUser();

                if (!mounted) return;

                setUser(data.user as unknown as User);
            } catch {
                router.replace("/login");
            }
        })();

        return () => {
            mounted = false;
        };
    }, [router]);


    async function logout() {
        try {
            await logoutUser();
        } catch (error) {
            console.error("Logout failed:", error);
        }

        router.replace("/login");
    }


    if (!user) {
        return (
            <main className="center-page">
                <div className="loading-spinner" />
                <p>Loading profile...</p>
            </main>
        );
    }


    return (
        <main className="dashboard">

            <header className="topbar">

                <div className="brand">

                    <div className="brand-icon">
                        ✓
                    </div>

                    <div>
                        <h1>
                            Profile
                        </h1>

                        <p>
                            Your account information
                        </p>
                    </div>

                </div>


                <div className="topbar-actions">

                    <button
                        className="secondary-button"
                        onClick={() =>
                            router.push("/tasks")
                        }
                    >
                        ← Tasks
                    </button>

                    <button
                        className="logout-button"
                        onClick={logout}
                    >
                        Logout
                    </button>

                </div>

            </header>


            <section className="profile-section">

                <div className="profile-card">

                    <div className="profile-avatar">
                        {user.name
                            .charAt(0)
                            .toUpperCase()}
                    </div>


                    <h2>
                        {user.name}
                    </h2>

                    <span
                        className={`profile-role ${
                            user.role === "admin"
                                ? "profile-role-admin"
                                : ""
                        }`}
                    >
                        {user.role}
                    </span>


                    <div className="profile-details">

                        <div className="profile-detail">

                            <span className="profile-label">
                                Name
                            </span>

                            <span className="profile-value">
                                {user.name}
                            </span>

                        </div>


                        <div className="profile-detail">

                            <span className="profile-label">
                                Email
                            </span>

                            <span className="profile-value">
                                {user.email}
                            </span>

                        </div>


                        <div className="profile-detail">

                            <span className="profile-label">
                                User ID
                            </span>

                            <span className="profile-value profile-id">
                                {user.id}
                            </span>

                        </div>


                        <div className="profile-detail">

                            <span className="profile-label">
                                Role
                            </span>

                            <span className="profile-value">
                                {user.role}
                            </span>

                        </div>

                    </div>

                </div>

            </section>

        </main>
    );
}