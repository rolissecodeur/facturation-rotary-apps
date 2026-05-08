import React from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { ThemeProvider } from "./contexts/ThemeProvider";
import { SocketProvider } from "./contexts/SocketProvider";
import { AuthProvider } from "./contexts/AuthProvider";
import routes from "./routes/route"; // tes routes
import "./index.css";
import "./App.css";

const queryClient = new QueryClient();
const router = createBrowserRouter(routes);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Toaster position="top-right" containerStyle={{ zIndex: 99999 }} />

    <QueryClientProvider client={queryClient}>
  
    <SocketProvider>
      <AuthProvider>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
      </AuthProvider>
    </SocketProvider>
  
</QueryClientProvider>

  </React.StrictMode>
);
