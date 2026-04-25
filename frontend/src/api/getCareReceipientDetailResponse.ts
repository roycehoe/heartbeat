import { useQuery } from "@tanstack/react-query";
import { httpClient } from "./httpClient";
import { CareReceipientDetailOut } from "./types";

export async function getCareReceipientDetailResponse(
  userId: number
): Promise<CareReceipientDetailOut> {
  const response = await httpClient.get(`/user/${userId}`);
  return response.data;
}

export function useGetCareReceipientDetailResponse(userId: number) {
  return useQuery({
    queryKey: ["getCareReceipientDetailResponse", userId],
    queryFn: () => getCareReceipientDetailResponse(userId),
    enabled: !!userId,
  });
}
