import { useQuery } from "@tanstack/react-query";
import { biddersService } from "../../services/bidders";

export const useActiveAuction = () => {
  return useQuery({
    queryKey: ["activeAuction"],
    queryFn: biddersService.checkActiveAuction,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
