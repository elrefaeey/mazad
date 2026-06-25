import { useQuery } from "@tanstack/react-query";
import { unitsApi } from "../../services/units";

export interface AvailableAdvance {
  value: number;
  price_per_meter: number;
  payment_duration: string;
  selected: boolean;
}

export interface UnitAvailableAdvancesResponse {
  status: string;
  message: string;
  data: {
    id: string;
    unit_number: string;
    area: string;
    closed: boolean;
    auction: {
      id: string;
      name: string;
      status: string;
      startDate: string;
      endDate: string;
    };
    advances_summary: {
      total_advances: number;
      available_advances: number;
      selected_advances: number;
    };
    available_advances: AvailableAdvance[];
    selected_advances: AvailableAdvance[];
  };
  meta: {
    unit_id: string;
    unit_number: string;
    available_advances_count: number;
    has_available_advances: boolean;
    request_timestamp: string;
  };
}

export const useUnitAvailableAdvances = (unitId: string) => {
  return useQuery({
    queryKey: ["unit-available-advances", unitId],
    queryFn: () => unitsApi.getUnitAvailableAdvances(unitId),
    enabled: !!unitId,
  });
};
