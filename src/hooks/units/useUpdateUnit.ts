import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Api } from "../../services/api";
import { showToast } from "../../utils/toast";
import { handleError } from "../../utils/errorHandling";

interface UpdateUnitData {
  id: string;
  unit_number: string;
  area: string;
  specs: string;
  starting_price_per_meter: string;
  advances: {
    value: number;
    price_per_meter: number;
    payment_duration: string;
    selected?: boolean;
  }[];
  image?: File | null;
  mainImage?: File | null;
  recieve_duration: string;
}

export function useUpdateUnit(auctionId: string, onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateUnitData) => {
      const formData = new FormData();

      formData.append("unit_number", data.unit_number);
      formData.append("area", data.area);
      formData.append("specs", data.specs);
      formData.append("recieve_duration", data.recieve_duration);
      formData.append(
        "starting_price_per_meter",
        data.starting_price_per_meter
      );
      formData.append("advances", JSON.stringify(data.advances));

      if (data.image) {
        formData.append("image", data.image);
      }
      if (data.mainImage) {
        formData.append("mainImage", data.mainImage);
      }

      const response = await Api.put(`/admin/units/${data.id}`, formData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["auction-details", auctionId],
      });
      queryClient.invalidateQueries({ queryKey: ["auctions"] });
      showToast.success("تم تحديث الوحدة بنجاح");
      onSuccess?.();
    },
    onError: (error: unknown) => {
      console.error("Error updating unit:", error);
      handleError(error);
    },
  });
}
