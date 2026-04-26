import { useMutation } from "@tanstack/react-query";
import { httpClient } from "./httpClient";
import { CareReceipientLoginUrlResponse } from "./types";

export async function postRevokeMagicLink(
  careReceipientId: number
): Promise<CareReceipientLoginUrlResponse> {
  const response = await httpClient.post(`/user/${careReceipientId}/login-url/revoke`);
  return response.data;
}

export function usePostRevokeMagicLink() {
  return useMutation({
    mutationFn: (careReceipientId: number) => postRevokeMagicLink(careReceipientId),
  });
}
