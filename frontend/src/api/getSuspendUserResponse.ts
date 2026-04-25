import { useMutation } from "@tanstack/react-query";
import { httpClient } from "./httpClient";

export async function getSuspendUserResponse(userId: number): Promise<null> {
  const response = await httpClient.put(`/user/${userId}/suspend`);
  return response.data;
}

export function useSuspendUser() {
  return useMutation({
    mutationFn: (userId: number) => getSuspendUserResponse(userId),
  });
}
