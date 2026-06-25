import { useQuery } from "@tanstack/react-query";
import { biddingService } from "../../services";
import { UnitDetailsResponse } from "src/types/bidding";

export const useUnitDetails = (unitId: string) => {
  return useQuery<UnitDetailsResponse>({
    queryKey: ["unitDetails", unitId],
    queryFn: () => biddingService.getUnitDetails(unitId),
    enabled: !!unitId,
    refetchInterval: 5000,
    staleTime: 0,
  });
};
