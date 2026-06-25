import { Api } from "./api";
import { CreateUnitRequest, UpdateUnitRequest, Unit } from "../types/auctions";
import { handleError } from "../utils/errorHandling";

export const unitsApi = {
  // Get all units for an auction
  getUnits: async (auctionId: string): Promise<Unit[]> => {
    try {
      const response = await Api.get(`/auctions/${auctionId}/units`);
      // Ensure the response matches the Unit type
      return response.data as Unit[];
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  // Get a specific unit
  getUnit: async (auctionId: string, unitId: string): Promise<Unit> => {
    try {
      const response = await Api.get(`/auctions/${auctionId}/units/${unitId}`);
      return response.data as Unit;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  // Create a new unit
  createUnit: async (data: CreateUnitRequest): Promise<Unit> => {
    try {
      const formData = new FormData();

      formData.append("unit_number", data.unit_number);
      formData.append("area", data.area);
      formData.append("specs", data.specs);
      formData.append("payment_duration", data.payment_duration);
      formData.append(
        "starting_price_per_meter",
        data.starting_price_per_meter
      );
      formData.append("advances", JSON.stringify(data.advances));
      formData.append("auction_id", data.auction_id);

      if (data.image && data.image instanceof File) {
        formData.append("image", data.image);
      }

      const response = await Api.post(
        `/auctions/${data.auction_id}/units`,
        formData
      );
      return response.data as Unit;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  // Update an existing unit
  updateUnit: async (data: UpdateUnitRequest): Promise<Unit> => {
    try {
      const formData = new FormData();

      formData.append("unit_number", data.unit_number);
      formData.append("area", data.area);
      formData.append("specs", data.specs);
      formData.append("payment_duration", data.payment_duration);
      formData.append(
        "starting_price_per_meter",
        data.starting_price_per_meter
      );
      formData.append("advances", JSON.stringify(data.advances));

      if (data.image && data.image instanceof File) {
        formData.append("image", data.image);
      }

      const response = await Api.put(
        `/auctions/${data.auction_id}/units/${data.id}`,
        formData
      );
      return response.data as Unit;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  // Delete a unit
  deleteUnit: async (auctionId: string, unitId: string): Promise<void> => {
    try {
      await Api.delete(`/auctions/${auctionId}/units/${unitId}`);
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  // Add bidder to unit
  addBidderToUnit: async (
    unitId: string,
    data: {
      name: string;
      phone: string;
      national_id: string;
      advance_value: number;
      price_per_meter: number;
    }
  ): Promise<{ status: string; message: string; data?: unknown }> => {
    try {
      const response = await Api.post(
        `/admin/units/${unitId}/add-bidder`,
        data
      );
      return response.data as {
        status: string;
        message: string;
        data?: unknown;
      };
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  // Get available advances for a unit
  getUnitAvailableAdvances: async (unitId: string) => {
    try {
      const response = await Api.get(
        `/admin/units/${unitId}/available-advances`
      );
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
};
