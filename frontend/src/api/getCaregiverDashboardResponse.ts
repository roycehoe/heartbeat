import { useQuery } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import { httpClient } from "@/api/httpClient";
import type { CareReceipientDetailOut } from "@/api/types";

export async function getCaregiverDashboardResponse(): Promise<
  AxiosResponse<CareReceipientDetailOut[]>
> {
  return await httpClient.get("/admin/dashboard");
}

export function useGetCaregiverDashboardResponse() {
  return useQuery({
    queryKey: ["getCaregiverDashboardResponse"],
    queryFn: () => getCaregiverDashboardResponse(),
    refetchInterval: 5 * 60 * 1000,
  });
}
