import { useQuery } from "@tanstack/react-query";
import { httpClient } from "@/api/httpClient";
import type { CareReceipientDashboardOut } from "@/api/types";

export async function getCareReceipientDashboardResponse(
  careReceipientId: number
): Promise<CareReceipientDashboardOut> {
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
