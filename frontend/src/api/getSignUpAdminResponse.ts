import { useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { httpClient } from "./httpClient";
import { SignUpAdminRequest } from "./types";

export async function getSignUpAdminResponse(
  signUpAdminRequest: SignUpAdminRequest
): Promise<AxiosResponse<null>> {
  return await httpClient.post("/admin/sign-up", signUpAdminRequest);
}

export function useGetSignUpAdminResponse() {
  return useMutation({
    mutationFn: (request: SignUpAdminRequest) =>
      getSignUpAdminResponse(request),
  });
}
