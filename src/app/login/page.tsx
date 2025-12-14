"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/store/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuth((s) => s.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data);
      router.push("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-20">
      <h1 className="text-2xl mb-4">Login</h1>

      <a
        href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google`}
        className="btn-outline w-full mt-3"
      >
        Continue with Google
      </a>

      <input
        type="email"
        placeholder="Email"
        className="input"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="input mt-3"
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <p className="text-red-600 mt-2">{error}</p>}

      <button disabled={loading} className="btn w-full mt-4">
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
