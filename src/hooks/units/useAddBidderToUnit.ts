import { useMutation, useQueryClient } from "@tanstack/react-query";
import { unitsApi } from "../../services/units";
import { showToast } from "../../utils/toast";
import { handleError } from "../../utils/errorHandling";

export interface AddBidderData {
  name: string;
  phone: string;
  national_id: string;
  advance_value: number;
  price_per_meter: number;
}

export interface AddBidderResponse {
  status: string;
  message: string;
  data?: unknown;
}

export const useAddBidderToUnit = (unitId: string, onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation<AddBidderResponse, Error, AddBidderData>({
    mutationFn: (data: AddBidderData) => unitsApi.addBidderToUnit(unitId, data),
    onSuccess: () => {
      showToast.success("تم إضافة المزايد بنجاح");
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["unit-bidders", unitId] });
      queryClient.invalidateQueries({ queryKey: ["auction-bidders", unitId] });
      queryClient.invalidateQueries({
        queryKey: ["unit-available-advances", unitId],
      });
      queryClient.invalidateQueries({ queryKey: ["units"] });
      queryClient.invalidateQueries({ queryKey: ["auction-details"] });
      onSuccess?.();
    },
    onError: (error: unknown) => {
      console.error("Error adding bidder:", error);
      handleError(error);
    },
  });
};
