import { ProtectedRoute } from "@/components/common/ProtectedRoute";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ProtectedRoute>{children}</ProtectedRoute>
    </>
  );
}
