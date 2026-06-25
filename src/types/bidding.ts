import { PaymentStatus } from "./enums";

// Types for unit details and bidding
export interface UnitDetails {
  id: string;
  unit_number: string;
  area: number;
  specs: string;
  mainImage: string | null;
  recieve_duration: string;
  starting_price_per_meter: number;
  advances: {
    value: number;
    price_per_meter: number;
    payment_duration: string;
    selected?: boolean;
    _id: string;
  }[];
  image: string;
  closed: boolean;
  auction: {
    _id: string;
    name: string;
    startDate: string;
    endDate: string;
  };
  createdAt: string;
}

export interface BidderParticipation {
  is_participating: boolean;
  offers_count: number;
  bid_details?: {
    price_per_meter: number;
    advance_value: number;
    total_price: number;
    advance_amount: number;
    bid_time: string;
  };
}

export interface TopBidder {
  rank: number;
  bidder_id: string;
  bidder_name: string;
  price_per_meter: number;
  advance_value: number;
  total_price: number;
  advance_amount: number;
  bid_time: string;
  payment_duration: string;
}

export interface BiddingStatistics {
  total_bids: number;
  lowest_price_per_meter: number;
  highest_advance_value: number;
}

export interface Deposit {
  amount: number;
  can_bid: boolean;
  expires_at: string | null;
  has_deposit: boolean;
  is_expired: boolean;
  message: string;
  paid_at: string | null;
  payment_required: boolean;
  payment_status: PaymentStatus | null;
  payment_url: string | null;
}
export interface UnitDetailsResponse {
  status: string;
  data: {
    unit: UnitDetails;
    deposit: Deposit;
    bidder_participation: BidderParticipation;
    top_bidders: TopBidder[];
    statistics: BiddingStatistics;
  };
}

export interface PlaceBidRequest {
  unit_id: string;
  price_per_meter: number;
  advance_value: number;
}

export interface PlaceBidResponse {
  status: string;
  message: string;
  data: {
    bid: {
      id: string;
      price_per_meter: number;
      advance_value: number;
      total_price: number;
      advance_amount: number;
      bid_time: string;
    };
  };
}

// Deposit types
export interface DepositStatusResponse {
  status: string;
  data: {
    has_deposit: boolean;
    can_bid: boolean;
    message?: string;
    deposit?: {
      _id: string;
      bidder: string;
      unit: {
        _id: string;
        unit_number: string;
        area: string;
      };
      amount: number;
      payment_status: "pending" | "paid" | "failed" | "expired";
      paid_at?: string;
      expires_at: string;
      is_expired: boolean;
      can_bid: boolean;
      createdAt: string;
      updatedAt: string;
    };
    payment_status?: string;
    paid_at?: string;
    expires_at?: string;
    is_expired?: boolean;
  };
}

export interface CreateDepositResponse {
  status: string;
  message: string;
  data: {
    deposit: {
      _id: string;
      bidder: string;
      unit: string;
      amount: number;
      payment_status: string;
      expires_at: string;
      createdAt: string;
      updatedAt: string;
    };
    payment_url: string;
    amount: number;
    expires_at: string;
  };
}

export interface PaymentStatusResponse {
  status: string;
  data: {
    payment_status: "failed" | "success" | "pending" | "processing";
    amount: string;
    buyer_name: string;
    buyer_email: string;
    buyer_mobile: string;
    payment_method: string;
    voucher: string;
    easykash_ref: string;
    message: string;
    inquiry_result: {
      PaymentMethod: string;
      Amount: string;
      BuyerName: string;
      BuyerEmail: string;
      BuyerMobile: string;
      status: "FAILED" | "SUCCESS" | "PENDING" | "PROCESSING";
      voucher: string;
      easykashRef: string;
    };
  };
}
