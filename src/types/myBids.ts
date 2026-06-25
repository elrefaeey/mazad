// Types for My Bids page
export interface MyBidUnit {
  id: string;
  unit_number: string;
  project_name: string;
  area: number;
  image: string;
}

export interface MyBidAuction {
  id: string;
  name: string;
  status: "active" | "closed" | "ended";
  startDate: string;
  endDate: string;
}

export interface MyBidDetails {
  price_per_meter: number;
  advance_value: number;
  total_price: number;
  advance_amount: number;
  payment_duration: number;
  bid_time: string;
  rank: number;
}

export interface MyBidDeposit {
  id: string;
  amount: number;
  payment_status: "paid" | "pending" | "refunded" | "failed";
  paid_at: string | null;
  refund_initiated_at: string | null;
  refunded_at: string | null;
}

export interface MyBid {
  unit: MyBidUnit;
  auction: MyBidAuction;
  my_bid: MyBidDetails;
  bid_status: "ongoing" | "outbid" | "winner" | "lost";
  deposit: MyBidDeposit;
  insurance_status: string;
}

export interface MyBidsResponse {
  data: {
    bids: MyBid[];
    totalBids: number;
  };
}
