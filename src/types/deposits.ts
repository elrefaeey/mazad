export interface DepositBidder {
  _id: string;
  name: string;
  phone: string;
  national_id: string;
}

export interface DepositUnit {
  _id: string;
  unit_number: string;
  area: string;
  id: string;
}

export interface DepositAuction {
  _id: string;
  name: string;
  id: string;
}

export interface PaymobData {
  payment_key: string;
  response_data?: any;
}

export interface StatusHistoryItem {
  status: string;
  changed_at: string;
  notes: string;
  paymob_response: any;
  _id: string;
  id: string;
}

export interface Deposit {
  _id: string;
  id: string;
  bidder: DepositBidder | null;
  unit: DepositUnit | null;
  auction: DepositAuction | null;
  amount: number;
  payment_status: "processing" | "completed" | "failed" | "expired";
  expires_at: string;
  status_history: StatusHistoryItem[];
  createdAt: string;
  updatedAt: string;
  payment_url?: string;
  paymob_order_id?: string;
  is_expired: boolean;
  can_bid: boolean;
  paymob_data: PaymobData;
}

export interface DepositsPagination {
  current_page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface DepositsResponse {
  status: string;
  data: {
    deposits: Deposit[];
    pagination: DepositsPagination;
  };
}

export interface DepositsQueryParams {
  page?: number;
  per_page?: number;
  status?: string;
  search?: string;
}

export interface RefundRequest {
  refundAmount?: number; // Optional - for partial refund
  callbackUrl?: string; // Optional - webhook for response
  reason?: string; // Optional - refund reason
}

export interface RefundResponse {
  status: string;
  message: string;
  data: {
    deposit: Deposit;
    refund: {
      refund_id: string;
      amount: number;
      status: string;
      processed_at: string;
    };
  };
}
