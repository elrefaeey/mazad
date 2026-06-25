import { useMutation, useQueryClient } from "@tanstack/react-query";
import { auctionService } from "../../services";
import { CreateAuctionRequest } from "../../types/auctions";
import { showToast } from "../../utils/toast";
import { handleError } from "../../utils/errorHandling";

export const useCreateAuction = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAuctionRequest) =>
      auctionService.createAuction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auctions"] });
      showToast.success("تم إضافة المزاد بنجاح");
      onSuccess?.();
    },
    onError: (error: unknown) => {
      handleError(error);
    },
  });
};
