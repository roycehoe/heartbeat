import { useMutation } from "@tanstack/react-query";
import { httpClient } from "./httpClient";
import { CareReceipientCreateRequest } from "./types";

export async function getCareReceipientUpdateResponse(
  careReceipientId: number,
  careReceipientCreateRequest: CareReceipientCreateRequest
): Promise<null> {
  const response = await httpClient.put(
    `/user/${careReceipientId}`,
    careReceipientCreateRequest
  );
  return response.data;
}

export function useGetCareReceipientUpdateResponse() {
  return useMutation({
    mutationFn: ({
      careReceipientId,
      request,
    }: {
      careReceipientId: number;
      request: CareReceipientCreateRequest;
    }) => getCareReceipientUpdateResponse(careReceipientId, request),
  });
}
