import { useQuery } from "@tanstack/react-query";
import { Api } from "../../services/api";

interface BidderResponse {
  _id: string;
  name: string;
  phone: string;
  national_id: string;
}

interface AuctionBid {
  _id: string;
  unit: {
    _id: string;
    unit_number: string;
  };
  bidder: BidderResponse;
  auction: string;
  advance_value: number;
  price_per_meter: number;
  total_price: number;
  national_id: string;
  advance_amount: number;
  remaining_amount: number;
  status: string;
  bid_time: string;
  createdAt: string;
  updatedAt: string;
}

interface AuctionBiddersResponse {
  success: boolean;
  messages: string[];
  data: {
    unit: {
      id: string;
      unit_number: string;
      area: string;
      specs: string;
    };
    auction: {
      id: string;
      title: string;
    };
    bids: AuctionBid[];
  };
}

interface ProcessedAuctionBidder {
  name: string;
  deposit: string;
  price: string;
  unit: string;
  date: string;
  phone: string;
  national_id: string;
  auction_id: string;
  highlight: boolean;
  advance_amount: number;
}

export const useAuctionBidders = (auctionId: string) => {
  return useQuery({
    queryKey: ["auction-bidders", auctionId],
    queryFn: async (): Promise<ProcessedAuctionBidder[]> => {
      if (!auctionId) throw new Error("Auction ID is required");

      const response = await Api.get<AuctionBiddersResponse>(
        `/admin/units/${auctionId}/bids`
      );

      if (!response.data.success) {
        throw new Error(
          response.data.messages[0] || "Failed to fetch auction bids"
        );
      }

      const { bids } = response.data.data;

      return bids.map((bid, index) => ({
        name: bid.bidder.name,
        deposit: `مقدم %${bid.advance_value}`,
        price: bid.price_per_meter.toString(),
        advance_amount: bid.advance_amount,
        unit: response.data.data?.unit?.unit_number,
        date: new Date(bid.bid_time)
          .toLocaleString("ar-EG", {
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            hour12: false,
          })
          .replace(",", " -"),
        phone: bid.bidder.phone,
        national_id: bid.bidder.national_id,

        auction_id: bid.auction,

        highlight: index === 0,
      }));
    },
    enabled: !!auctionId,
  });
};

export type { ProcessedAuctionBidder };
