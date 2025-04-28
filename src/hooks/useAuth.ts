"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

export interface DecodedToken {
  role: "admin" | "supplier";
  id: string;
  [key: string]: unknown;
}

export function useAuth() {
  const router = useRouter();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  useEffect(() => {
    if (!token) {
      router.push("/login");
    } else {
      const decoded = jwtDecode<DecodedToken>(token || "");

      if (decoded.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/supplier");
      }
    }
  }, [token, router]);
}
