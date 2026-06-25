import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useBidderAuth } from "../contexts/bidderAuth";

interface BidderProtectedRouteProps {
  children: ReactNode;
}

export const BidderProtectedRoute = ({
  children,
}: BidderProtectedRouteProps) => {
  const { isAuthenticated } = useBidderAuth();

  if (!isAuthenticated) {
    return <Navigate to="/bidders/auth" replace />;
  }

  return <>{children}</>;
};
