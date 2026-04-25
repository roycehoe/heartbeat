import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { httpClient } from "./httpClient";
import { DashboardResponse } from "./types";

export async function getAdminDashboardResponse(): Promise<
  AxiosResponse<DashboardResponse[]>
> {
  return await httpClient.get("/admin/dashboard");
}

export function useGetAdminDashboardResponse() {
  return useQuery({
    queryKey: ["getAdminDashboardResponse"],
    queryFn: () => getAdminDashboardResponse(),
    refetchInterval: 5 * 60 * 1000,
  });
}
