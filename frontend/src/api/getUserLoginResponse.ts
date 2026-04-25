import { useMutation } from "@tanstack/react-query";
import { httpClient } from "./httpClient";
import { LoginResponse, UserLoginRequest } from "./types";

export async function getUserLoginResponse(
  loginRequest: UserLoginRequest
): Promise<LoginResponse> {
  const response = await httpClient.post("/user/login", loginRequest);
  return response.data;
}

export function useGetUserLoginResponse() {
  return useMutation({
    mutationFn: (request: UserLoginRequest) => getUserLoginResponse(request),
  });
}
