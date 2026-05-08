import { useEffect, useContext } from "react"; // 👈 Ajout de useContext
import { Outlet } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ThemeProvider } from "../contexts/ThemeProvider";
import { AuthProvider } from "../contexts/AuthProvider";
import { SocketProvider } from "../contexts/SocketProvider";
import { SocketContext } from "../contexts/socket-context"; // 👈 On importe le Contexte
import { useAuth } from "../hooks/useAuth";
import { aggregatePermissions } from "../utils/permissions";

const queryClient = new QueryClient();

function SocketEventManager() {
  const socket = useContext(SocketContext); // 👈 On utilise useContext directement
  const { user, setUser, setPermissions } = useAuth();

  useEffect(() => {
    if (socket && user) {
      const handlePermissionsUpdate = (updatedUserFromSocket) => {
        if (updatedUserFromSocket.id !== user.id) return;

        const newUserState = { ...user, rolesUsers: updatedUserFromSocket.rolesUsers };
        
        setUser(newUserState);
        localStorage.setItem("user", JSON.stringify(newUserState));
        
        setPermissions(aggregatePermissions(newUserState.rolesUsers));
      };

      socket.on("permissions_updated", handlePermissionsUpdate);
      return () => {
        socket.off("permissions_updated", handlePermissionsUpdate);
      };
    }
  }, [socket, user, setUser, setPermissions]);

  return null;
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SocketProvider>
          <QueryClientProvider client={queryClient}>
            <SocketEventManager />
            <Outlet />
            <Toaster containerStyle={{ zIndex: 99999 }} />
          </QueryClientProvider>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}