import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { biddingService } from "../../services/bidding";
import {
  UnitDetailsResponse,
  PlaceBidRequest,
  PlaceBidResponse,
  DepositStatusResponse,
  CreateDepositResponse,
  PaymentStatusResponse,
} from "../../types/bidding";
import { handleError } from "../../utils/errorHandling";

export const useUnitDetails = (unitId: string) => {
  return useQuery<UnitDetailsResponse>({
    queryKey: ["unitDetails", unitId],
    queryFn: () => biddingService.getUnitDetails(unitId),
    enabled: !!unitId,
    refetchInterval: 5000,
    staleTime: 0,
  });
};

export const usePlaceBid = () => {
  const queryClient = useQueryClient();

  return useMutation<PlaceBidResponse, Error, PlaceBidRequest>({
    mutationFn: biddingService.placeBid,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["unitDetails", variables.unit_id],
      });

      queryClient.invalidateQueries({
        queryKey: ["auctionUnits"],
      });
    },
    onError: (error) => {
      handleError(error);
      console.error("Bid placement error:", error);
    },
  });
};

export const useUnitLiveUpdates = (
  unitId: string,
  isEnabled: boolean = true
) => {
  return useQuery<UnitDetailsResponse>({
    queryKey: ["unitLiveUpdates", unitId],
    queryFn: () => biddingService.getUnitLiveUpdates(unitId),
    enabled: !!unitId && isEnabled,
    refetchInterval: 3000, // More frequent updates for live bidding
    staleTime: 0,
  });
};

// Hook to check deposit status
export const useDepositStatus = (unitId: string) => {
  return useQuery<DepositStatusResponse>({
    queryKey: ["depositStatus", unitId],
    queryFn: () => biddingService.checkDepositStatus(unitId),
    enabled: !!unitId,
    refetchInterval: 30000, // Check every 30 seconds
    staleTime: 0,
  });
};

// Hook to create deposit
export const useCreateDeposit = () => {
  const queryClient = useQueryClient();

  return useMutation<
    CreateDepositResponse,
    Error,
    {
      unitId: string;
      price_per_meter: string;
      advance_value: string;
    }
  >({
    mutationFn: biddingService.createDeposit,
    onSuccess: (_, unitId) => {
      queryClient.invalidateQueries({
        queryKey: ["depositStatus", unitId],
      });
    },
    onError: (error) => {
      handleError(error);
      console.error("Deposit creation error:", error);
    },
  });
};

// Hook to get payment status
export const usePaymentStatus = (depositId: string) => {
  return useQuery<PaymentStatusResponse>({
    queryKey: ["paymentStatus", depositId],
    queryFn: () => biddingService.getPaymentStatus(depositId),
    enabled: !!depositId,
    staleTime: 0,
  });
};
