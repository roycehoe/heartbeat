import { useMutation, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "@/api/httpClient";
import type { CareReceipientMoodOut, CareReceipientMoodRequest } from "@/api/types";

export async function getCareReceipientMoodResponse(
  moodRequest: CareReceipientMoodRequest,
  careReceipientId: number
): Promise<CareReceipientMoodOut> {
  const response = await httpClient.post(`/user/${careReceipientId}/mood`, moodRequest);
  return response.data;
}

export function useGetCareReceipientMoodResponse(careReceipientId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: CareReceipientMoodRequest) =>
      getCareReceipientMoodResponse(request, careReceipientId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getCareReceipientDashboardResponse", careReceipientId],
      });
    },
  });
}
