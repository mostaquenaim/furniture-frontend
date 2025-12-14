"use client";

import { useEffect } from "react";
import { useAuth } from "@/store/auth";
import { useRouter } from "next/navigation";

export default function AuthCallback() {
  const router = useRouter();
  const login = useAuth((s) => s.login);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        login(data);
        router.push("/");
      });
  }, []);

  return <p>Signing you in...</p>;
}
