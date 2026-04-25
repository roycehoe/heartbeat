import { useMutation, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "./httpClient";

export async function getDeleteUserResponse(userId: number): Promise<null> {
  const response = await httpClient.delete(`/user/${userId}`);
  return response.data;
}

export function useGetDeleteUserResponse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: number) => getDeleteUserResponse(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAdminDashboardResponse"] });
    },
  });
}
