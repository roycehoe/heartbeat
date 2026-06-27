import { useQuery } from "@tanstack/react-query";
import { httpClient } from "@/api/httpClient";
import type { CareReceipientDetailOut } from "@/api/types";

export async function getCareReceipientDashboardResponse(
  careReceipientId: number
): Promise<CareReceipientDetailOut> {
  const response = await httpClient.get(`/user/${careReceipientId}/dashboard`);
  return response.data;
}

export function useGetCareReceipientDashboardResponse(careReceipientId: number) {
  return useQuery({
    queryKey: ["careReceipient", careReceipientId, "dashboard"],
    queryFn: () => getCareReceipientDashboardResponse(careReceipientId),
    refetchInterval: 60 * 60 * 1000,
    retry: false,
    enabled: !!careReceipientId,
  });
}
