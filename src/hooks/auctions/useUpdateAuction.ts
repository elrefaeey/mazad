import { useMutation, useQueryClient } from "@tanstack/react-query";
import { auctionService } from "../../services";
import { UpdateAuctionRequest } from "../../types/auctions";
import { showToast } from "../../utils/toast";
import { handleError } from "../../utils/errorHandling";

export const useUpdateAuction = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateAuctionRequest) =>
      auctionService.updateAuction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auctions"] });
      showToast.success("تم تعديل المزاد بنجاح");
      onSuccess?.();
    },
    onError: (error: unknown) => {
      handleError(error);
    },
  });
};
