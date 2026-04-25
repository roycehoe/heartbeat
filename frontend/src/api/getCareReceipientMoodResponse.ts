import { useMutation, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "./httpClient";
import { CareReceipientMoodOut, CareReceipientMoodRequest } from "./types";

export async function getCareReceipientMoodResponse(
  moodRequest: CareReceipientMoodRequest
): Promise<CareReceipientMoodOut> {
  const response = await httpClient.post("/user/mood", moodRequest);
  return response.data;
}

export function useGetCareReceipientMoodResponse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: CareReceipientMoodRequest) =>
      getCareReceipientMoodResponse(request),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getCareReceipientDashboardResponse"],
      });
    },
  });
}
