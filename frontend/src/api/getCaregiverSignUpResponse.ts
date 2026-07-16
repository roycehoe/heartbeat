import { useMutation } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import { httpClient } from "@/api/httpClient";
import type { CaregiverCreateRequest } from "@/api/types";

export async function getCaregiverSignUpResponse(
  caregiverCreateRequest: CaregiverCreateRequest
): Promise<AxiosResponse<null>> {
  return await httpClient.post("/admin/sign-up", caregiverCreateRequest);
}

export function useGetCaregiverSignUpResponse() {
  return useMutation({
    mutationFn: (request: CaregiverCreateRequest) =>
      getCaregiverSignUpResponse(request),
  });
}
