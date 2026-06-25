import { useMutation, useQueryClient } from "@tanstack/react-query";
import { auctionService } from "../../services";
import { showToast } from "../../utils/toast";
import { handleError } from "../../utils/errorHandling";

export const useDeleteAuction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => auctionService.deleteAuction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auctions"] });
      showToast.success("تم حذف المزاد بنجاح");
    },
    onError: (error: unknown) => {
      handleError(error);
    },
  });
};
