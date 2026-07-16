import { useQuery } from "@tanstack/react-query";
import { httpClient } from "@/api/httpClient";
import type { CareReceipientDetailOut } from "@/api/types";

export async function getCaregiverDashboardResponse(): Promise<
  CareReceipientDetailOut[]
> {
  const response = await httpClient.get("/admin/dashboard");
  return response.data;
}

export function useGetCaregiverDashboardResponse() {
  return useQuery({
    queryKey: ["caregiver", "dashboard"],
    queryFn: () => getCaregiverDashboardResponse(),
    refetchInterval: 5 * 60 * 1000,
  });
}
