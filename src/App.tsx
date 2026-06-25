import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./contexts/darkmode";
import { AuthProvider } from "./contexts/auth";
import { BidderAuthProvider } from "./contexts/bidderAuth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import router from "./routes/index";

const queryClient = new QueryClient({
  defaultOptions:{
    queries:{
      refetchOnWindowFocus: false,
    }
  }
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BidderAuthProvider>
          <ThemeProvider storageKey="ui-theme">
            <RouterProvider router={router} />
          </ThemeProvider>
        </BidderAuthProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
