import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { httpClient } from "./httpClient";
import { CareReceipientDetailOut } from "./types";

export async function getCareReceipientDashboardResponse(
  careReceipientId: number
): Promise<AxiosResponse<CareReceipientDetailOut>> {
  return await httpClient.get(`/user/${careReceipientId}/dashboard`);
}

export function useGetCareReceipientDashboardResponse(careReceipientId: number) {
  return useQuery({
    queryKey: ["getCareReceipientDashboardResponse", careReceipientId],
    queryFn: () => getCareReceipientDashboardResponse(careReceipientId),
    refetchInterval: 60 * 60 * 1000,
    retry: false,
  });
}
