import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { httpClient } from "./httpClient";
import { CareReceipientDetailOut } from "./types";

export async function getCareReceipientDashboardResponse(): Promise<
  AxiosResponse<CareReceipientDetailOut>
> {
  return await httpClient.get("/user/dashboard");
}

export function useGetCareReceipientDashboardResponse() {
  return useQuery({
    queryKey: ["getCareReceipientDashboardResponse"],
    queryFn: () => getCareReceipientDashboardResponse(),
    refetchInterval: 60 * 60 * 1000,
  });
}
