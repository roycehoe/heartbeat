import { useQuery } from "@tanstack/react-query";
import { httpClient } from "./httpClient";
import { DashboardResponse } from "./types";

export async function getAdminUserResponse(
  userId: number
): Promise<DashboardResponse> {
  const response = await httpClient.get(`/user/${userId}`);
  return response.data;
}

export function useGetAdminUserResponse(userId: number) {
  return useQuery({
    queryKey: ["getAdminUserResponse", userId],
    queryFn: () => getAdminUserResponse(userId),
    enabled: !!userId,
  });
}
