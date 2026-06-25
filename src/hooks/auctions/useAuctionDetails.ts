import { useQuery } from "@tanstack/react-query";
import { Api } from "../../services/api";
import { ApiResponse, AuctionDetailsResponse } from "../../types/auctions";

export function useAuctionDetails(auctionId: string) {
  return useQuery({
    queryKey: ["auction-details", auctionId],
    queryFn: async () => {
      const response = await Api.get<ApiResponse<AuctionDetailsResponse>>(
        `/admin/auctions/${auctionId}`
      );
      return response.data.data;
    },
    enabled: !!auctionId,
  });
}
