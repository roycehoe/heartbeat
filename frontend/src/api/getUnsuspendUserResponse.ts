import { useMutation } from "@tanstack/react-query";
import { httpClient } from "./httpClient";

export async function getUnsuspendUserResponse(userId: number): Promise<null> {
  const response = await httpClient.put(`/user/${userId}/unsuspend`);
  return response.data;
}

export function useUnsuspendUser() {
  return useMutation({
    mutationFn: (userId: number) => getUnsuspendUserResponse(userId),
  });
}
