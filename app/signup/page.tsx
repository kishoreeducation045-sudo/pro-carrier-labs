"use client";
import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Eye, EyeOff, Zap, Mail, Lock, User, Phone } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
    </svg>
  );
}

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const supabase = createClient();

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleGoogleSignup() {
    setLoading(true);
    setError("");
    try {
      const { error: err } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      if (err) {
        setError(err.message);
        setLoading(false);
      }
    } catch (err: any) {
      setError("Google authentication error: " + (err.message || "Failed to initialize"));
      setLoading(false);
    }
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const { error: err } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            full_name: form.fullName,
            phone: form.phone,
          },
          emailRedirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });

      if (err) {
        setError(err.message);
        setLoading(false);
      } else {
        setSuccess(true);
      }
    } catch (err: any) {
      setError("Signup failed: " + (err.message || "Unexpected error occurred"));
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0a0f1e",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 400 }}>
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>✉️</div>
          <h2 style={{ color: "#f9fafb", fontWeight: 800, fontSize: "1.5rem", margin: "0 0 0.75rem" }}>
            Check your email!
          </h2>
          <p style={{ color: "#94a3b8", lineHeight: 1.7 }}>
            We sent a confirmation link to <strong style={{ color: "#f9fafb" }}>{form.email}</strong>.
            Click it to activate your account and start learning.
          </p>
          <Link href="/login" style={{ display: "inline-block", marginTop: "1.5rem", color: "#1e6fff", fontWeight: 600, textDecoration: "none" }}>
            Back to Sign In →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0f1e",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1.5rem",
      }}
    >
      <div
        style={{
          position: "fixed",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 600,
          height: 600,
          background: "radial-gradient(circle, rgba(245,166,35,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ width: "100%", maxWidth: 480, position: "relative", zIndex: 1 }}>
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            textDecoration: "none",
            justifyContent: "center",
            marginBottom: "2.5rem",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              background: "linear-gradient(135deg, #1e6fff, #f5a623)",
              borderRadius: 11,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Zap size={22} color="#fff" fill="#fff" />
          </div>
          <span style={{ fontWeight: 800, fontSize: "1.25rem", color: "#f9fafb", letterSpacing: "-0.02em" }}>
            Pro<span style={{ color: "#1e6fff" }}>Career</span>Labs
          </span>
        </Link>

        <div
          style={{
            background: "rgba(17,24,39,0.95)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 24,
            padding: "2.5rem",
            boxShadow: "0 32px 64px rgba(0,0,0,0.4)",
          }}
        >
          <h1
            style={{
              fontSize: "1.75rem",
              fontWeight: 800,
              color: "#f9fafb",
              margin: "0 0 0.5rem",
              letterSpacing: "-0.02em",
            }}
          >
            Create your account
          </h1>
          <p style={{ color: "#64748b", margin: "0 0 2rem", fontSize: "0.9375rem" }}>
            Join 12,000+ professionals levelling up with AI
          </p>

          {/* Google OAuth */}
          <button
            onClick={handleGoogleSignup}
            disabled={loading}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.75rem",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 12,
              padding: "0.875rem",
              color: "#f9fafb",
              fontWeight: 600,
              fontSize: "0.9375rem",
              cursor: "pointer",
              transition: "all 0.2s",
              marginBottom: "1.5rem",
            }}
          >
            <GoogleIcon />
            Sign up with Google
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
            <span style={{ color: "#475569", fontSize: "0.8125rem" }}>or with email</span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
          </div>

          {error && (
            <div
              style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.25)",
                borderRadius: 10,
                padding: "0.75rem 1rem",
                color: "#fca5a5",
                fontSize: "0.875rem",
                marginBottom: "1.25rem",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {/* Full Name */}
            <div>
              <label style={{ display: "block", color: "#94a3b8", fontSize: "0.875rem", fontWeight: 500, marginBottom: "0.5rem" }}>
                Full Name
              </label>
              <div style={{ position: "relative" }}>
                <User size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
                <input
                  type="text"
                  required
                  value={form.fullName}
                  onChange={set("fullName")}
                  placeholder="Ravi Sharma"
                  className="input-field"
                  style={{ paddingLeft: "2.75rem" }}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={{ display: "block", color: "#94a3b8", fontSize: "0.875rem", fontWeight: 500, marginBottom: "0.5rem" }}>
                Email address
              </label>
              <div style={{ position: "relative" }}>
                <Mail size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={set("email")}
                  placeholder="ravi@email.com"
                  className="input-field"
                  style={{ paddingLeft: "2.75rem" }}
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label style={{ display: "block", color: "#94a3b8", fontSize: "0.875rem", fontWeight: 500, marginBottom: "0.5rem" }}>
                WhatsApp Number
              </label>
              <div style={{ position: "relative" }}>
                <Phone size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={set("phone")}
                  placeholder="9876543210"
                  className="input-field"
                  style={{ paddingLeft: "2.75rem" }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ display: "block", color: "#94a3b8", fontSize: "0.875rem", fontWeight: 500, marginBottom: "0.5rem" }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <Lock size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={set("password")}
                  placeholder="Min 8 characters"
                  className="input-field"
                  style={{ paddingLeft: "2.75rem", paddingRight: "3rem" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#64748b", cursor: "pointer", padding: 0 }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label style={{ display: "block", color: "#94a3b8", fontSize: "0.875rem", fontWeight: 500, marginBottom: "0.5rem" }}>
                Confirm Password
              </label>
              <div style={{ position: "relative" }}>
                <Lock size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.confirmPassword}
                  onChange={set("confirmPassword")}
                  placeholder="Re-enter password"
                  className="input-field"
                  style={{ paddingLeft: "2.75rem" }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                background: loading ? "rgba(30,111,255,0.5)" : "#1e6fff",
                color: "#fff",
                fontWeight: 700,
                fontSize: "1rem",
                padding: "0.9375rem",
                borderRadius: 12,
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                marginTop: "0.5rem",
              }}
            >
              {loading ? "Creating account..." : "Create Account →"}
            </button>
          </form>

          <p style={{ textAlign: "center", color: "#64748b", fontSize: "0.8125rem", marginTop: "1.5rem" }}>
            By signing up, you agree to our{" "}
            <Link href="/terms" style={{ color: "#1e6fff", textDecoration: "none" }}>Terms</Link>{" "}
            and{" "}
            <Link href="/privacy" style={{ color: "#1e6fff", textDecoration: "none" }}>Privacy Policy</Link>.
          </p>

          <p style={{ textAlign: "center", color: "#64748b", fontSize: "0.875rem", marginTop: "0.75rem" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "#1e6fff", fontWeight: 600, textDecoration: "none" }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#0a0f1e" }} />}>
      <SignupForm />
    </Suspense>
  );
}
