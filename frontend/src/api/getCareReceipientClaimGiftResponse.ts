import { useMutation, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "@/api/httpClient";
import { CareReceipientDetailOut } from "@/api/types";

export async function getCareReceipientClaimGiftResponse(): Promise<CareReceipientDetailOut> {
  const response = await httpClient.get("/user/claim_gift");
  return response.data;
}

export function useGetCareReceipientClaimGiftResponse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => getCareReceipientClaimGiftResponse(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getCareReceipientDashboardResponse"],
      });
    },
  });
}
