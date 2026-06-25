import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Api } from "../../services/api";
import { showToast } from "../../utils/toast";
import { handleError } from "../../utils/errorHandling";

interface CreateUnitData {
  unit_number: string;
  area: string;
  specs: string;
  starting_price_per_meter: string;
  recieve_duration: string;
  advances: {
    value: number;
    price_per_meter: number;
    payment_duration: string;
    selected?: boolean;
  }[];
  image?: File | null;
  mainImage?: File | null;
}

export function useCreateUnit(auctionId: string, onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateUnitData) => {
      const formData = new FormData();
      formData.append("auction", auctionId);
      formData.append("unit_number", data.unit_number);
      formData.append("area", data.area);
      formData.append("specs", data.specs);
      formData.append(
        "starting_price_per_meter",
        data.starting_price_per_meter
      );
      formData.append("recieve_duration", data.recieve_duration);
      formData.append("advances", JSON.stringify(data.advances));

      if (data.image) {
        formData.append("image", data.image);
      }
      if (data.mainImage) {
        formData.append("mainImage", data.mainImage);
      }
      const response = await Api.post(
        `/admin/auctions/${auctionId}/units`,
        formData
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["auction-details", auctionId],
      });
      queryClient.invalidateQueries({ queryKey: ["auctions"] });
      showToast.success("تم إضافة الوحدة بنجاح");
      onSuccess?.();
    },
    onError: (error: unknown) => {
      console.error("Error creating unit:", error);
      handleError(error);
    },
  });
}
