import { BidderApi } from "./bidderApi";
import { MyBidsResponse } from "../types/myBids";

export const myBidsApi = {
  getMyBids: async (): Promise<MyBidsResponse> => {
    const response = await BidderApi.get<MyBidsResponse>("/bidders/my-bids");
    return response.data;
  },
};
