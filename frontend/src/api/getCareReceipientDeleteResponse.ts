import { useMutation } from "@tanstack/react-query";
import { httpClient } from "@/api/httpClient";

export async function getCareReceipientDeleteResponse(
  careReceipientId: number
): Promise<null> {
  const response = await httpClient.delete(`/user/${careReceipientId}`);
  return response.data;
}

export function useGetCareReceipientDeleteResponse() {
  return useMutation({
    mutationFn: (careReceipientId: number) =>
      getCareReceipientDeleteResponse(careReceipientId),
  });
}
