import { useQuery } from "@tanstack/react-query";
import { auctionService } from "../../services";

export const useAuctions = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["auctions", page, limit],
    queryFn: async () => {
      console.log("Fetching auctions...");
      const result = await auctionService.getAuctions(page, limit);
      console.log("Auctions result:", result);
      return result;
    },
    staleTime: 5 * 60 * 1000, 
  });
};

export const useAuction = (id: string) => {
  return useQuery({
    queryKey: ["auction", id],
    queryFn: () => auctionService.getAuction(id),
    enabled: !!id,
  });
};

export const useActiveAuctions = () => {
  return useQuery({
    queryKey: ["auctions", "active"],
    queryFn: () => auctionService.getActiveAuctions(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useUpcomingAuctions = () => {
  return useQuery({
    queryKey: ["auctions", "upcoming"],
    queryFn: () => auctionService.getUpcomingAuctions(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
