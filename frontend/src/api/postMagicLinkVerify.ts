import { useMutation } from "@tanstack/react-query";
import { httpClient } from "./httpClient";
import { CareReceipientToken, MagicLinkVerifyRequest } from "./types";

export async function postMagicLinkVerify(
  request: MagicLinkVerifyRequest
): Promise<CareReceipientToken> {
  const response = await httpClient.post("/user/magic-link/verify", request);
  return response.data;
}

export function usePostMagicLinkVerify() {
  return useMutation({
    mutationFn: (request: MagicLinkVerifyRequest) => postMagicLinkVerify(request),
  });
}
