export interface Auction {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status?: "active" | "upcoming" | "ended";
  description?: string;
  address?: string;
  image?: string;
  unit_count?: number;
  createdAt?: string;
  updatedAt?: string;
}
export interface AuctionRes {
  data: Auction[];

  total: number;
  page: number;
  limit: number;
}
export interface CreateAuctionRequest {
  name: string;
  startDate: string;
  endDate: string;
  description?: string;
  address?: string;
  image?: File | null;
}
export interface CloseAuctionRequest {
  id: string;
}

export interface UpdateAuctionRequest extends CreateAuctionRequest {
  id: string;
}

export interface AuctionResponse {
  data: Auction[];

  total: number;
  page: number;
  limit: number;
}

export interface AuctionFormData {
  name: string;
  startDate: string;
  endDate: string;
  description?: string;
  address?: string;
  image?: File | null;
}

export interface Unit {
  id: string;
  unit_number: string;
  area: string;
  specs: string;
  startPrice?: string;
  recieve_duration?: string;
  highest_bid: number;
  best_price_per_meter: number;
  bid_count: number;
  advances?: Advance[];
  image?: string;
  mainImage?: string;
  closed?: boolean;
  auction_id?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Advance {
  value: number;
  price_per_meter: number;
  payment_duration: string;
  selected?: boolean;
}

export interface UnitFormData {
  unit_number: string;
  area: string;
  specs: string;
  payment_duration: string;
  starting_price_per_meter: string;
  advances: Advance[];
  image?: File | null;
  mainImage?: File | null;
}

export interface CreateUnitRequest {
  unit_number: string;
  area: string;
  specs: string;
  payment_duration: string;
  starting_price_per_meter: string;
  advances: Advance[];
  image?: File | null;
  mainImage?: File | null;
  auction_id: string;
}

export interface UpdateUnitRequest extends CreateUnitRequest {
  id: string;
}

export interface ApiResponse<T> {
  status: string;
  data: T;
}

export interface AuctionDetailsResponse {
  auction: Auction;
  units: Unit[];
  unitsCount: number;
}
