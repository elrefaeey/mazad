import { useQuery } from "@tanstack/react-query";
import { myBidsApi } from "../../services/myBids";

export const useMyBids = () => {
  return useQuery({
    queryKey: ["myBids"],
    queryFn: myBidsApi.getMyBids,
    retry: 1,
  });
};
