import { useQuery } from "@tanstack/react-query";
import { httpClient } from "./httpClient";
import { CareReceipientDetailOut } from "./types";

export async function getCareReceipientDetailResponse(
  careReceipientId: number
): Promise<CareReceipientDetailOut> {
  const response = await httpClient.get(`/user/${careReceipientId}`);
  return response.data;
}

export function useGetCareReceipientDetailResponse(careReceipientId: number) {
  return useQuery({
    queryKey: ["getCareReceipientDetailResponse", careReceipientId],
    queryFn: () => getCareReceipientDetailResponse(careReceipientId),
    enabled: !!careReceipientId,
  });
}
