"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { register } from "../../lib/api";

export default function SignupPage() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            await register(name, email, password);

            setSuccess(
                "Account created successfully. Redirecting to login..."
            );

            setTimeout(() => {
                router.replace("/login");
            }, 1000);
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Registration failed"
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="auth-page">
            <div className="auth-card">
                <div className="brand">
                    <div className="brand-icon">✓</div>

                    <div>
                        <h1>Task Board</h1>
                        <p>Task Management System</p>
                    </div>
                </div>

                <div className="auth-heading">
                    <h2>Create an account</h2>
                    <p>Sign up to start managing your tasks.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <label>Name</label>

                    <input
                        type="text"
                        placeholder="Your name"
                        value={name}
                        onChange={(event) =>
                            setName(event.target.value)
                        }
                        required
                    />

                    <label>Email</label>

                    <input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(event) =>
                            setEmail(event.target.value)
                        }
                        required
                    />

                    <label>Password</label>

                    <input
                        type="password"
                        placeholder="Create a password"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                        required
                    />

                    {error && (
                        <div className="error-box">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="success-box">
                            {success}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="primary-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating account..."
                            : "Sign up"}
                    </button>
                </form>

                <p className="auth-switch">
                    Already have an account?{" "}
                    <Link href="/login">
                        Sign in
                    </Link>
                </p>
            </div>
        </main>
    );
}