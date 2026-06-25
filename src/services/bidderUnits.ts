import { BidderApi } from "./bidderApi";
import { handleError } from "../utils/errorHandling";

export interface AuctionUnit {
  id: string;
  unit_number: string;
  area: string;
  specs: string;
  payment_duration: string;
  starting_price_per_meter: number;
  mainImage: string;
  best_price_per_meter: number;
  highest_bid: number;
  recieve_duration: number;
  advances: {
    value: number;
    price_per_meter: number;
    selected?: boolean;
    _id: string;
  }[];
  image: string;
  closed: boolean;
  createdAt: string;
}

export interface AuctionData {
  _id: string;
  name: string;
  startDate: string;
  image: string;
  description: string;
  address: string;
  endDate: string;
}

export interface AuctionUnitsResponse {
  status: string;
  results: number;
  hasActiveAuction:boolean;
  data: {
    auction: AuctionData;
    units: AuctionUnit[];
  };
}

export const getAuctionUnits = async (): Promise<AuctionUnitsResponse> => {
  try {
    const response = await BidderApi.get<AuctionUnitsResponse>(
      "/bidders/auction/units"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching auction units:", error);
    handleError(error);
    throw error;
  }
};
