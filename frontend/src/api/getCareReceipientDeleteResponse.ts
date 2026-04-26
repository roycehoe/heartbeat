import { useMutation, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "./httpClient";

export async function getCareReceipientDeleteResponse(
  careReceipientId: number
): Promise<null> {
  const response = await httpClient.delete(`/user/${careReceipientId}`);
  return response.data;
}

export function useGetCareReceipientDeleteResponse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (careReceipientId: number) =>
      getCareReceipientDeleteResponse(careReceipientId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getCaregiverDashboardResponse"],
      });
    },
  });
}
