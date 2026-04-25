import { useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { httpClient } from "./httpClient";
import { CreateUserRequest } from "./types";

export async function getCreateUserResponse(
  createUserRequest: CreateUserRequest
): Promise<AxiosResponse<null>> {
  return await httpClient.post("/user", createUserRequest);
}

export function useGetCreateNewUser() {
  return useMutation({
    mutationFn: (request: CreateUserRequest) => getCreateUserResponse(request),
  });
}
