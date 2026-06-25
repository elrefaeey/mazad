import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Api } from "../../services/api";
import { showToast } from "../../utils/toast";
import { handleError } from "../../utils/errorHandling";

export function useDeleteUnit(auctionId: string, onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (unitId: string) => {
      await Api.delete(`/admin/auctions/${auctionId}/units/${unitId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["auction-details", auctionId],
      });
      queryClient.invalidateQueries({ queryKey: ["auctions"] });

      showToast.success("تم حذف الوحدة بنجاح");
      onSuccess?.();
    },
    onError: (error: unknown) => {
      console.error("Error deleting unit:", error);
      handleError(error);
    },
  });
}
