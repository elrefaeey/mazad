import { useQuery } from "@tanstack/react-query";
import { Api } from "../../services/api";

interface BidderResponse {
  _id: string;
  name: string;
  phone: string;
  national_id: string;
}

interface Bid {
  _id: string;
  unit: string;
  bidder: BidderResponse;
  auction: string;
  advance_value: number;
  price_per_meter: number;
  total_price: number;
  advance_amount: number;
  remaining_amount: number;
  status: string;
  bid_time: string;
  createdAt: string;
  updatedAt: string;
}

interface UnitBidsResponse {
  success: boolean;
  messages: string[];
  data: {
    unit: {
      id: string;
      unit_number: string;
      area: string;
      specs: string;
    };
    bids: Bid[];
  };
}

interface ProcessedBidder {
  id: string;
  name: string;
  phone: string;
  bidAmount: number;
  bidPercentage: number;
  timestamp: string;
  unitNumber: string;
  pricePerMeter: number;
  isWinning?: boolean;
  nationalId: string;
  totalPrice: number;
  advanceAmount: number;
}

export const useUnitBidders = (unitId: string) => {
  return useQuery({
    queryKey: ["unit-bidders", unitId],
    queryFn: async (): Promise<ProcessedBidder[]> => {
      if (!unitId) throw new Error("Unit ID is required");

      const response = await Api.get<UnitBidsResponse>(
        `/admin/units/${unitId}/bids`
      );

      if (!response.data.success) {
        throw new Error(
          response.data.messages[0] || "Failed to fetch unit bids"
        );
      }

      const { unit, bids } = response.data.data;

      return bids.map((bid, index) => ({
        id: bid._id,
        name: bid.bidder.name,
        phone: bid.bidder.phone,
        nationalId: bid.bidder.national_id,
        bidAmount: bid.advance_value,
        bidPercentage: bid.advance_value,
        timestamp: new Date(bid.bid_time).toLocaleString("ar-EG"),
        unitNumber: unit.unit_number,
        pricePerMeter: bid.price_per_meter,
        totalPrice: bid.total_price,
        advanceAmount: bid.advance_amount,
        isWinning: index === 0, // First bid (highest price) is winning
      }));
    },
    enabled: !!unitId,
  });
};

export type { ProcessedBidder };
