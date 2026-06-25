import { BidderApi } from "./bidderApi";
import {
  UnitDetailsResponse,
  PlaceBidRequest,
  PlaceBidResponse,
  DepositStatusResponse,
  CreateDepositResponse,
  PaymentStatusResponse,
} from "../types/bidding";
import { handleError } from "../utils/errorHandling";

export const biddingService = {
  // Get unit details with bidding information
  getUnitDetails: async (unitId: string): Promise<UnitDetailsResponse> => {
    try {
      const response = await BidderApi.get<UnitDetailsResponse>(
        `/bidders/units/${unitId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching unit details:", error);
      handleError(error);
      throw error;
    }
  },

  // Place a bid on a unit
  placeBid: async (bidData: PlaceBidRequest): Promise<PlaceBidResponse> => {
    try {
      const response = await BidderApi.post<PlaceBidResponse>("/bids", bidData);
      return response.data;
    } catch (error) {
      console.error("Error placing bid:", error);
      handleError(error);
      throw error;
    }
  },

  getUnitLiveUpdates: async (unitId: string): Promise<UnitDetailsResponse> => {
    try {
      const response = await BidderApi.get<UnitDetailsResponse>(
        `/bidders/units/${unitId}/live`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching live updates:", error);
      handleError(error);
      throw error;
    }
  },

  // Check deposit status for a unit
  checkDepositStatus: async (
    unitId: string
  ): Promise<DepositStatusResponse> => {
    try {
      const response = await BidderApi.get<DepositStatusResponse>(
        `/bid-deposits/units/${unitId}/deposit/status`
      );
      return response.data;
    } catch (error) {
      console.error("Error checking deposit status:", error);
      handleError(error);
      throw error;
    }
  },

  // Create deposit for a unit
  createDeposit: async ({
    unitId,
    price_per_meter,
    advance_value,
  }: {
    unitId: string;
    price_per_meter: string;
    advance_value: string;
  }): Promise<CreateDepositResponse> => {
    try {
      const response = await BidderApi.post<CreateDepositResponse>(
        `/bid-deposits/units/${unitId}/deposit`,
        { price_per_meter, advance_value, unitId, }
      );
      console.log("response", response);
      return response.data;
    } catch (error) {
      console.error("Error creating deposit:", error);
      handleError(error);
      throw error;
    }
  },

  // Get payment status for a deposit
  getPaymentStatus: async (
    depositId: string
  ): Promise<PaymentStatusResponse> => {
    try {
      const response = await BidderApi.get<PaymentStatusResponse>(
        `/bid-deposits/${depositId}/payment-status`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching payment status:", error);
      handleError(error);
      throw error;
    }
  },
};
