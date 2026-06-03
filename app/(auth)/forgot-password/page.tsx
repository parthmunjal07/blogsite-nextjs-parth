"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send reset link");
      }

      setMessage("If an account exists with that email, a password reset link has been sent.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-surface p-8 rounded-xl shadow-lg border border-outline-variant">
        <div className="text-center mb-8">
          <h2 className="font-headline-md text-headline-md font-bold text-on-surface">Forgot Password</h2>
          <p className="mt-2 font-body-md text-body-md text-on-surface-variant">
            Enter your email address to receive a password reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block font-label-md text-label-md text-on-surface mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded border border-outline-variant bg-surface text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              placeholder="you@example.com"
            />
          </div>

          {error && (
            <div className="text-error font-body-md text-body-md bg-error/10 p-3 rounded border border-error/20">
              {error}
            </div>
          )}

          {message && (
            <div className="text-primary font-body-md text-body-md bg-primary/10 p-3 rounded border border-primary/20">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-on-primary py-3 rounded font-label-md text-label-md font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex justify-center items-center"
          >
            {loading ? (
              <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/login" className="font-body-md text-body-md text-primary hover:underline">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
