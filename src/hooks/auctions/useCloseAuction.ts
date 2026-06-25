import { useMutation, useQueryClient } from "@tanstack/react-query";
import { auctionService } from "../../services";
import { CloseAuctionRequest } from "../../types/auctions";
import { showToast } from "../../utils/toast";
import { handleError } from "../../utils/errorHandling";

export const useCloseAuction = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CloseAuctionRequest) =>
      auctionService.closeAuction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auctions"] });
      showToast.success("تم إغلاق المزاد بنجاح");
      onSuccess?.();
    },
    onError: (error: unknown) => {
      handleError(error);
    },
  });
};
