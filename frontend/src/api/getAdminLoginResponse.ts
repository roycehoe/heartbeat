import { useMutation } from "@tanstack/react-query";
import { httpClerkClient } from "./httpClient";
import { LoginResponse } from "./types";

export async function getAdminLoginResponse(): Promise<LoginResponse> {
  const response = await httpClerkClient.post("/admin/login");
  return response.data;
}

export function useGetAdminLoginResponse() {
  return useMutation({
    mutationFn: () => getAdminLoginResponse(),
    retry: 1,
  });
}
