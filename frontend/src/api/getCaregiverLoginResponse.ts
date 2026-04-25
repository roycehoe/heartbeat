import { useMutation } from "@tanstack/react-query";
import { httpClerkClient } from "./httpClient";
import { CaregiverToken } from "./types";

export async function getCaregiverLoginResponse(): Promise<CaregiverToken> {
  const response = await httpClerkClient.post("/admin/login");
  return response.data;
}

export function useGetCaregiverLoginResponse() {
  return useMutation({
    mutationFn: () => getCaregiverLoginResponse(),
    retry: 1,
  });
}
