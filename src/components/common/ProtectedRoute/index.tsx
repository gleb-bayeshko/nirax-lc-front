"use client";
import { jwtDecode } from "jwt-decode";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isLoading, setLoading] = useState(true);
  const accessToken = window?.localStorage?.getItem("accessToken");
  const pathname = usePathname();

  useEffect(() => {
    if (!accessToken) {
      router.replace("/login");
    } else {
      const decoded = jwtDecode(accessToken);

      if (pathname.startsWith("/admin") && decoded.role !== "admin") {
        router.push("/supplier");
      } else if (
        pathname.startsWith("/supplier") &&
        decoded.role !== "supplier"
      ) {
        router.push("/admin");
      } else {
        setLoading(false);
      }
    }
  }, [accessToken, router, pathname]);

  if (isLoading) return null;

  return <>{children}</>;
}
