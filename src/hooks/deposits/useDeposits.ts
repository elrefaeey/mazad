import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { depositsApi } from "../../services/deposits";
import { DepositsQueryParams, RefundRequest } from "../../types/deposits";
import { toast } from "react-hot-toast";

export const useDeposits = (params?: DepositsQueryParams) => {
  return useQuery({
    queryKey: ["deposits", params],
    queryFn: () => depositsApi.getDeposits(params),
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 10000, // Consider data stale after 10 seconds
  });
};

export const useDepositById = (depositId: string) => {
  return useQuery({
    queryKey: ["deposit", depositId],
    queryFn: () => depositsApi.getDepositById(depositId),
    enabled: !!depositId,
  });
};

export const useRefundDeposit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      depositId,
      refundData,
    }: {
      depositId: string;
      refundData: RefundRequest;
    }) => depositsApi.refundDeposit(depositId, refundData),
    onSuccess: (data) => {
      toast.success(data.message || "تم استرداد المبلغ بنجاح");
      // Invalidate and refetch deposits
      queryClient.invalidateQueries({ queryKey: ["deposits"] });
      queryClient.invalidateQueries({ queryKey: ["deposit"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "فشل في استرداد المبلغ");
    },
  });
};
