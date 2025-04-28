"use client";

import MountedProvider from "@/providers/MountedProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "notistack";
import { ReactNode } from "react";

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{ horizontal: "right", vertical: "top" }}
      >
        <MountedProvider>{children}</MountedProvider>
      </SnackbarProvider>
    </QueryClientProvider>
  );
}
