import { Navigate } from "react-router-dom";
import ProtectedRoute from "../components/routing/ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import UsersPage from "../pages/UsersPage";
import PermissionsPage from "../pages/PermissionsPage";
import ClubPage from "../pages/ClubPage";
import FacturePage from "../pages/FacturePage";

const routes = [
  { path: "/login", element: <LoginPage /> },
  { path: "/", element: <LoginPage /> },
  {
    path: "/dashboard",
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "users", element: <ProtectedRoute permission="readUser"><UsersPage /></ProtectedRoute> },
      { path: "permissions", element: <ProtectedRoute permission="readPermission"><PermissionsPage /></ProtectedRoute> },
      // permission="readClub"
      { path: "clubs", element: <ProtectedRoute ><ClubPage /></ProtectedRoute> }, 
      { path: "factures", element: <ProtectedRoute ><FacturePage /></ProtectedRoute> }, 
    ],
  },
  { path: "*", element: <Navigate to="/login" replace /> },
];

export default routes;