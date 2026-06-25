import { Api } from "./api";
import {
  ActiveAuctionResponse,
  BidderAuthResponse,
  BidderLoginRequest,
  BidderRegisterRequest,
} from "../types/bidders";
import { handleError } from "../utils/errorHandling";

export const biddersService = {
  // Check if there's an active auction (no auth required)
  checkActiveAuction: async (): Promise<ActiveAuctionResponse> => {
    try {
      const response = await Api.get<ActiveAuctionResponse>(
        "/auctions/current"
      );
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  // Register a new bidder (no auth required)
  register: async (
    data: BidderRegisterRequest
  ): Promise<BidderAuthResponse> => {
    try {
      const response = await Api.post<BidderAuthResponse>(
        "/bidders/register",
        data
      );
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  // Login existing bidder (no auth required)
  login: async (data: BidderLoginRequest): Promise<BidderAuthResponse> => {
    try {
      console.log("Service: Sending login request to API with data:", data);
      const response = await Api.post<BidderAuthResponse>(
        "/bidders/login",
        data
      );
      console.log("Service: Login API response:", response.data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
};
