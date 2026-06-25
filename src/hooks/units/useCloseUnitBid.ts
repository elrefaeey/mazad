import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Api } from "../../services/api";
import { showToast } from "../../utils/toast";
import { handleError } from "../../utils/errorHandling";

export function useCloseUnitBid(auctionId: string, onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (unitId: string) => {
      console.log("Closing unit bid for unit:", unitId);
      const response = await Api.patch(`/admin/units/${unitId}/close`, {});
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["auction-details", auctionId],
      });
      queryClient.invalidateQueries({ queryKey: ["auctions"] });
      showToast.success("تم إغلاق المزايدة بنجاح");
      onSuccess?.();
    },
    onError: (error: unknown) => {
      console.error("Error closing unit bid:", error);
      handleError(error);
    },
  });
}
