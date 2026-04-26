import { useMutation } from "@tanstack/react-query";
import { httpClient } from "@/api/httpClient";

export async function getCareReceipientSuspendResponse(
  careReceipientId: number
): Promise<null> {
  const response = await httpClient.put(`/user/${careReceipientId}/suspend`);
  return response.data;
}

export function useGetCareReceipientSuspendResponse() {
  return useMutation({
    mutationFn: (careReceipientId: number) =>
      getCareReceipientSuspendResponse(careReceipientId),
  });
}
