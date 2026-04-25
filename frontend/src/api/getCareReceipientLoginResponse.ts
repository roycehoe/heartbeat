import { useMutation } from "@tanstack/react-query";
import { httpClient } from "./httpClient";
import { CareReceipientLogInRequest, CareReceipientToken } from "./types";

export async function getCareReceipientLoginResponse(
  loginRequest: CareReceipientLogInRequest
): Promise<CareReceipientToken> {
  const response = await httpClient.post("/user/login", loginRequest);
  return response.data;
}

export function useGetCareReceipientLoginResponse() {
  return useMutation({
    mutationFn: (request: CareReceipientLogInRequest) =>
      getCareReceipientLoginResponse(request),
  });
}
