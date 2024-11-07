// app/providers.tsx

"use client"; // Ensure this is a client-side component

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, ReactNode } from "react";

interface ReactQueryProviderProps {
  children: ReactNode; // Define the type for children
}

export function ReactQueryProvider({ children }: ReactQueryProviderProps) {
  const [queryClient] = useState(() => new QueryClient());

  const development = process.env.ENV != "production";
  console.log("🚀 ~ ReactQueryProvider ~ development:", development);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {development && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
} 
