export interface Bidder {
  id: string;
  name: string;
  phone: string;
  national_id: string;
  auction: string;
  isNewRegistration?: boolean;
  registeredAt?: string;
}

export interface BidderRegisterRequest {
  name: string;
  phone: string;
  national_id: string;
  auction_id?: string;
}

export interface BidderLoginRequest {
  national_id: string;
  auction_id?: string;
}

export interface BidderAuthResponse {
  success: boolean;
  messages: string[];
  data: {
    access_token: string;
    bidder: Bidder;
  };
}

export interface ActiveAuctionResponse {
  success: boolean;
  messages: string[];
  data: {
    auction: {
      id: string;
      name: string;
      startDate: string;
      endDate: string;
      status: "active" | "upcoming" | "ended";
      unitsCount: number;
      createdAt: string;
      updatedAt: string;
    };
  } | null;
}

export interface BidderFormData {
  name: string;
  phone: string;
  national_id: string;
}
//comment
export interface LiveBidder {
  rank: number;
  bidder_id: string;
  bidder_name: string;
  price_per_meter: number;
  advance_value: number;
  payment_duration: string;
  total_price: number;
  advance_amount: number;
  bid_time: string;
}
