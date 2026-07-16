import { useMutation } from "@tanstack/react-query";
import { httpClient } from "@/api/httpClient";

export async function getCareReceipientUnsuspendResponse(
  careReceipientId: number
): Promise<null> {
  const response = await httpClient.put(`/user/${careReceipientId}/unsuspend`);
  return response.data;
}

export function useGetCareReceipientUnsuspendResponse() {
  return useMutation({
    mutationFn: (careReceipientId: number) =>
      getCareReceipientUnsuspendResponse(careReceipientId),
  });
}
