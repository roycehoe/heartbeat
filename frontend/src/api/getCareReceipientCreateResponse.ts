import { useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { httpClient } from "./httpClient";
import { CareReceipientCreateRequest } from "./types";

export async function getCareReceipientCreateResponse(
  careReceipientCreateRequest: CareReceipientCreateRequest
): Promise<AxiosResponse<null>> {
  return await httpClient.post("/user", careReceipientCreateRequest);
}

export function useGetCareReceipientCreateResponse() {
  return useMutation({
    mutationFn: (request: CareReceipientCreateRequest) =>
      getCareReceipientCreateResponse(request),
  });
}
