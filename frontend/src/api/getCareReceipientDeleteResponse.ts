import { useMutation, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "./httpClient";

export async function getCareReceipientDeleteResponse(
  userId: number
): Promise<null> {
  const response = await httpClient.delete(`/user/${userId}`);
  return response.data;
}

export function useGetCareReceipientDeleteResponse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: number) => getCareReceipientDeleteResponse(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getCaregiverDashboardResponse"],
      });
    },
  });
}
