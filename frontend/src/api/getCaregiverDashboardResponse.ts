import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { httpClient } from "./httpClient";
import { CareReceipientDetailOut } from "./types";

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
