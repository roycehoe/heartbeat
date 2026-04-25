import { useMutation } from "@tanstack/react-query";
import { httpClient } from "./httpClient";
import { CreateUserRequest } from "./types";

export async function getUpdateUserResponse(
  userId: number,
  createUserRequest: CreateUserRequest
): Promise<null> {
  const response = await httpClient.put(`/user/${userId}`, createUserRequest);
  return response.data;
}

export function useUpdateUser() {
  return useMutation({
    mutationFn: ({
      userId,
      request,
    }: {
      userId: number;
      request: CreateUserRequest;
    }) => getUpdateUserResponse(userId, request),
  });
}
