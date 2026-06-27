import { useMutation } from "@tanstack/react-query";
import { httpClient } from "@/api/httpClient";
import type { CareReceipientDetailOut } from "@/api/types";

export async function getCareReceipientClaimGiftResponse(): Promise<CareReceipientDetailOut> {
  const response = await httpClient.get("/user/claim_gift");
  return response.data;
}

export function useGetCareReceipientClaimGiftResponse() {
  return useMutation({
    mutationFn: () => getCareReceipientClaimGiftResponse(),
  });
}
