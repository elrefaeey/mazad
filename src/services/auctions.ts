import { Api } from "./api";
import {
  Auction,
  CreateAuctionRequest,
  UpdateAuctionRequest,
  AuctionResponse,
  AuctionRes,
  CloseAuctionRequest,
} from "../types/auctions";
import { handleError } from "../utils/errorHandling";

export const auctionService = {
  // Get all auctions
  getAuctions: async (page = 1, limit = 10): Promise<AuctionResponse> => {
    try {
      const response = await Api.get<AuctionRes>(
        `/admin/auctions?page=${page}&limit=${limit}`
      );
      return {
        data: response.data.data || [],
        total: response.data.total,
        page: response.data.page,
        limit: response.data.limit,
      };
    } catch (error) {
      console.warn("API call failed, falling back to mock data:", error);
      return {
        page: 0,
        total: 0,
        limit: 0,
        data: [],
      };
    }
  },

  // Get single auction
  getAuction: async (id: string): Promise<Auction> => {
    try {
      const response = await Api.get<Auction>(`/admin/auctions/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  // Create auction
  createAuction: async (data: CreateAuctionRequest): Promise<Auction> => {
    try {
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("startDate", data.startDate);
      formData.append("endDate", data.endDate);

      if (data.description) {
        formData.append("description", data.description);
      }

      if (data.address) {
        formData.append("address", data.address);
      }

      if (data.image && data.image instanceof File) {
        formData.append("image", data.image);
      }

      const response = await Api.post<Auction>("/admin/auctions", formData);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  // Close auction
  closeAuction: async (data: CloseAuctionRequest): Promise<Auction> => {
    try {
      const response = await Api.post<Auction>(
        `/admin/auctions/${data.id}/close`,
        null
      );
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  // Update auction
  updateAuction: async (data: UpdateAuctionRequest): Promise<Auction> => {
    try {
      const { id, ...updateData } = data;
      const formData = new FormData();

      formData.append("name", updateData.name);
      formData.append("startDate", updateData.startDate);
      formData.append("endDate", updateData.endDate);

      if (updateData.description) {
        formData.append("description", updateData.description);
      }

      if (updateData.address) {
        formData.append("address", updateData.address);
      }

      if (updateData.image && updateData.image instanceof File) {
        formData.append("image", updateData.image);
      }

      const response = await Api.put<Auction>(
        `/admin/auctions/${id}`,
        formData
      );
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  // Delete auction
  deleteAuction: async (id: string): Promise<void> => {
    try {
      await Api.delete(`/admin/auctions/${id}`);
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  // Get active auctions
  getActiveAuctions: async (): Promise<Auction[]> => {
    try {
      const response = await Api.get<Auction[]>("/admin/auctions/active");
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  // Get upcoming auctions
  getUpcomingAuctions: async (): Promise<Auction[]> => {
    try {
      const response = await Api.get<Auction[]>("/admin/auctions/upcoming");
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
};
