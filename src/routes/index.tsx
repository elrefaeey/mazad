import { createBrowserRouter, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import AdminLogin from "../pages/AdminLogin";
import AuctionsPage from "../pages/AuctionsPage";
import AuctionDetailsPage from "../pages/AuctionDetailsPage";
import AuctionBiddersPage from "../pages/AuctionBiddersPage";
import UnitBiddersPage from "../pages/UnitBiddersPage";
import ClientHome from "../pages/ClientHome";
import UnitDetailsPage from "../pages/UnitDetailsPage";
import ProtectedRoute from "../components/ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import DepositsPage from "../pages/DepositsPage";
import SuccessPayment from "../pages/SuccessPayment";
import PaymentProcess from "../pages/PaymentProccess";
import FailedPayment from "../pages/ErrorPayment";
import RefundedPayment from "../pages/RefundedPayment";
import RefundPolicy from "../pages/Privacy";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import ClientLayout from "../components/layout/ClientLayout";
import CurrentAuction from "../pages/CurrentAuction";
import BidderLogin from "../pages/BidderLogin";
import BidderSignup from "../pages/BidderSignup";
import NotFound from "../pages/NotFound";
import MyBidsPage from "../pages/MyBidsPage";
import { BidderProtectedRoute } from "../components/BidderProtectedRoute";

const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/home" replace /> },

  {
    element: <ClientLayout />,
    children: [
      { path: "/refund-policy", element: <RefundPolicy /> },
      { path: "/privacy-policy", element: <PrivacyPolicy /> },
      { path: "/home", element: <ClientHome /> },
      { path: "/auction", element: <CurrentAuction /> },
      { path: "/units/:unitId", element: <UnitDetailsPage /> },
      { path: "/success", element: <SuccessPayment /> },
      { path: "/refunded", element: <RefundedPayment /> },
      { path: "/process", element: <PaymentProcess /> },
      { path: "/failed", element: <FailedPayment /> },
      {
        path: "/my-bids",
        element: (
          <BidderProtectedRoute>
            <MyBidsPage />
          </BidderProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <BidderLogin />,
  },
  {
    path: "/signup",
    element: <BidderSignup />,
  },
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },

  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "auctions",
        element: <AuctionsPage />,
      },
      {
        path: "auctions/:id",
        element: <AuctionDetailsPage />,
      },
      {
        path: "auctions/:id/bidders",
        element: <AuctionBiddersPage />,
      },
      {
        path: "auctions/:auctionId/units/:unitId/bidders",
        element: <UnitBiddersPage />,
      },

      {
        path: "deposits",
        element: <DepositsPage />,
      },
    ],
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
