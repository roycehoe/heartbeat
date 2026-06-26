import { useQuery } from "@tanstack/react-query";
import { httpClient } from "@/api/httpClient";
import type { CareReceipientLoginUrlResponse } from "@/api/types";

export async function getCareReceipientLoginUrlResponse(
  careReceipientId: number
): Promise<CareReceipientLoginUrlResponse> {
  const response = await httpClient.get(`/user/${careReceipientId}/login-url`);
  return response.data;
}

export function useGetCareReceipientLoginUrlResponse(careReceipientId: number) {
  return useQuery({
    queryKey: ["getCareReceipientLoginUrlResponse", careReceipientId],
    queryFn: () => getCareReceipientLoginUrlResponse(careReceipientId),
    enabled: !!careReceipientId,
  });
}
