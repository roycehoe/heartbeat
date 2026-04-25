import { useMutation } from "@tanstack/react-query";
import { httpClient } from "./httpClient";
import { CareReceipientCreateRequest } from "./types";

export async function getCareReceipientUpdateResponse(
  userId: number,
  careReceipientCreateRequest: CareReceipientCreateRequest
): Promise<null> {
  const response = await httpClient.put(
    `/user/${userId}`,
    careReceipientCreateRequest
  );
  return response.data;
}

export function useGetCareReceipientUpdateResponse() {
  return useMutation({
    mutationFn: ({
      userId,
      request,
    }: {
      userId: number;
      request: CareReceipientCreateRequest;
    }) => getCareReceipientUpdateResponse(userId, request),
  });
}
