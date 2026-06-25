import { createContext, useState, useContext, ReactNode } from "react";
import { BidderAuthResponse, Bidder } from "../types/bidders";

interface BidderAuthContextType {
  bidder: Bidder | null;
  token: string | null;
  loading: boolean;
  login: (response: BidderAuthResponse) => void;
  register: (response: BidderAuthResponse) => void;
  logout: () => void;
  isAuthenticated: boolean;
  updateBidderData: (updatedBidder: Partial<Bidder>) => void;
}

const BidderAuthContext = createContext<BidderAuthContextType | undefined>(
  undefined
);

interface BidderAuthProviderProps {
  children: ReactNode;
}

export const BidderAuthProvider = ({ children }: BidderAuthProviderProps) => {
  const [bidder, setBidder] = useState<Bidder | null>(() => {
    const savedBidder = localStorage.getItem("bidderData");
    return savedBidder ? JSON.parse(savedBidder) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("bidderToken");
  });

  const [loading] = useState(false);

  const login = (response: BidderAuthResponse) => {
    const { access_token, bidder: bidderData } = response.data;

    setToken(access_token);
    setBidder(bidderData);

    localStorage.setItem("bidderToken", access_token);
    localStorage.setItem("bidderData", JSON.stringify(bidderData));
    localStorage.setItem("bidderId", bidderData.id);

    // إرسال حدث لإعلام باقي الـ components بتسجيل الدخول
    window.dispatchEvent(new Event("authChange"));
  };

  const register = (response: BidderAuthResponse) => {
    login(response);
  };

  const logout = () => {
    setToken(null);
    setBidder(null);
    localStorage.removeItem("bidderToken");
    localStorage.removeItem("bidderData");
    localStorage.removeItem("bidderId");


    window.location.href = "/login";
  };

  const updateBidderData = (updatedBidder: Partial<Bidder>) => {
    if (bidder) {
      const newBidderData = { ...bidder, ...updatedBidder };
      setBidder(newBidderData);
      localStorage.setItem("bidderData", JSON.stringify(newBidderData));
    }
  };

  const isAuthenticated = !!token && !!bidder;
  const value: BidderAuthContextType = {
    bidder,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated,
    updateBidderData,
  };

  return (
    <BidderAuthContext.Provider value={value}>
      {children}
    </BidderAuthContext.Provider>
  );
};

export const useBidderAuth = () => {
  const context = useContext(BidderAuthContext);
  if (context === undefined) {
    throw new Error("useBidderAuth must be used within a BidderAuthProvider");
  }
  return context;
};
