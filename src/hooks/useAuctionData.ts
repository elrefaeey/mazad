import { useState, useEffect } from "react";
import { getAuctionUnits, AuctionUnitsResponse } from "../services/bidderUnits";
import { getErrorMessages } from "../utils/errorHandling";

export const useAuctionData = () => {
  const [auctionData, setAuctionData] = useState<AuctionUnitsResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAuctionUnits = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAuctionUnits();
      setAuctionData(data);
    } catch (error) {
      console.error("Error fetching auction units:", error);
      const errorMessages = getErrorMessages(error);
      setError(errorMessages[0] || "حدث خطأ في تحميل بيانات المزاد");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuctionUnits();

    // إضافة listener لتحديثات المصادقة
    const handleAuthChange = () => {
      const token = localStorage.getItem("bidderToken");
      const data = localStorage.getItem("bidderData");

      if (token && data) {
        fetchAuctionUnits();
      } else {
        setAuctionData(null);
        setLoading(false);
      }
    };

    window.addEventListener("authChange", handleAuthChange);

    return () => {
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

  return {
    auctionData,
    loading,
    error,
    refetch: fetchAuctionUnits,
  };
};
