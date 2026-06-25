import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Api } from "../services";
import { handleError } from "../utils/errorHandling";
import { showToast } from "../utils/toast";

type useDeleteProps = {
  url: string;
  queryKey: string[];
  resourceName: string;
};

export function useDelete({ url, queryKey, resourceName }: useDeleteProps) {
  const queryClient = useQueryClient();

  const { isPending: isDeleting, mutateAsync: deleteResource } = useMutation({
    mutationFn: async () => Api.delete(url),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKey });
      showToast.success(`تم حذف ${resourceName} بنجاح  `);
    },

    onError: (err) => handleError(err),
  });

  return { isDeleting, deleteResource };
}
