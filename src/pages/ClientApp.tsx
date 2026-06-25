import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useActiveAuction } from "../hooks/bidders/useActiveAuction";
import PageSpinner from "../components/ui/PageSpinner";
import { useBidderAuth } from "../contexts/bidderAuth";

function ClientApp() {
  const navigate = useNavigate();
  const { bidder } = useBidderAuth();

  const { data: auctionResponse, isLoading: isCheckingAuction } =
    useActiveAuction();

  useEffect(() => {
    if (bidder) {
      navigate("/home");
      return;
    }

    if (!isCheckingAuction && auctionResponse?.data?.auction) {
      navigate(`/bidders/login?auction_id=${auctionResponse.data.auction.id}`);
    } else if (!isCheckingAuction) {
      navigate("/bidders/login");
    }
  }, [bidder, isCheckingAuction, auctionResponse, navigate]);

  // أثناء التحميل، اعرض spinner
  if (isCheckingAuction) {
    return <PageSpinner fullPage />;
  }

  return <PageSpinner fullPage />;
}

export default ClientApp;
