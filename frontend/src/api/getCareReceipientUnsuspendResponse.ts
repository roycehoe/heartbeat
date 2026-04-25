import { useMutation } from "@tanstack/react-query";
import { httpClient } from "./httpClient";

export async function getCareReceipientUnsuspendResponse(
  userId: number
): Promise<null> {
  const response = await httpClient.put(`/user/${userId}/unsuspend`);
  return response.data;
}

export function useGetCareReceipientUnsuspendResponse() {
  return useMutation({
    mutationFn: (userId: number) =>
      getCareReceipientUnsuspendResponse(userId),
  });
}
