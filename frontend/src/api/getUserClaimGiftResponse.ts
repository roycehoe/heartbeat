import { useMutation, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "./httpClient";
import { DashboardResponse } from "./types";

export async function getUserClaimGiftResponse(): Promise<DashboardResponse> {
  const response = await httpClient.get("/user/claim_gift");
  return response.data;
}

export function useGetUserClaimGiftResponse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => getUserClaimGiftResponse(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getUserDashboardResponse"] });
    },
  });
}
