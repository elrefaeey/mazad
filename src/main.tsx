import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "./index.css";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          className: "",
          duration: 4000,
          style: {
            background: "#fff",
            color: "#1A1A1A",
            fontSize: "14px",
            fontFamily: "DIN Next LT Arabic, sans-serif",
            padding: "16px",

            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            border: "1px solid #E5E7EB",
            direction: "rtl",
          },
          // Customize for different types
          success: {
            duration: 3000,
            style: {
              background: "#F0F9FF",
              border: "1px solid #285240",
              color: "#285240",
            },
            iconTheme: {
              primary: "#285240",
              secondary: "#F0F9FF",
            },
          },
          error: {
            duration: 5000,
            style: {
              background: "#FEF2F2",
              border: "1px solid #DC2626",
              color: "#DC2626",
            },
            iconTheme: {
              primary: "#DC2626",
              secondary: "#FEF2F2",
            },
          },
          loading: {
            style: {
              background: "#FFFEF0",
              border: "1px solid #FBCD01",
              color: "#735700",
            },
            iconTheme: {
              primary: "#FBCD01",
              secondary: "#FFFEF0",
            },
          },
        }}
      />
    </QueryClientProvider>
  </StrictMode>
);
