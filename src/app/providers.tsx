"use client";

import MountedProvider from "@/providers/MountedProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "notistack";
import { RxCross2 } from "react-icons/rx";
import { closeSnackbar } from "notistack";
import { ReactNode } from "react";

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{ horizontal: "right", vertical: "top" }}
        classes={{ containerRoot: "mt-[50px]" }}
        autoHideDuration={2000}
        action={(snackbarId) => (
          <RxCross2
            onClick={() => closeSnackbar(snackbarId)}
            className="mr-2"
          />
        )}
      >
        <MountedProvider>{children}</MountedProvider>
      </SnackbarProvider>
    </QueryClientProvider>
  );
}
