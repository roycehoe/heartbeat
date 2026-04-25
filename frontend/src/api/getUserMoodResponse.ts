import { useMutation, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "./httpClient";
import { MoodRequest, MoodResponse } from "./types";

export async function getUserMoodResponse(
  moodRequest: MoodRequest
): Promise<MoodResponse> {
  const response = await httpClient.post("/user/mood", moodRequest);
  return response.data;
}

export function useGetUserMoodResponse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: MoodRequest) => getUserMoodResponse(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getUserDashboardResponse"] });
    },
  });
}
