import { useMutation } from "@tanstack/react-query";
import { httpClient } from "./httpClient";

export async function getCareReceipientSuspendResponse(
  userId: number
): Promise<null> {
  const response = await httpClient.put(`/user/${userId}/suspend`);
  return response.data;
}

export function useGetCareReceipientSuspendResponse() {
  return useMutation({
    mutationFn: (userId: number) => getCareReceipientSuspendResponse(userId),
  });
}
