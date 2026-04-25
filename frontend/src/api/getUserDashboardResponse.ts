import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { httpClient } from "./httpClient";
import { DashboardResponse } from "./types";

export async function getUserDashboardResponse(): Promise<
  AxiosResponse<DashboardResponse>
> {
  return await httpClient.get("/user/dashboard");
}

export function useGetUserDashboardResponse() {
  return useQuery({
    queryKey: ["getUserDashboardResponse"],
    queryFn: () => getUserDashboardResponse(),
    refetchInterval: 60 * 60 * 1000,
  });
}
