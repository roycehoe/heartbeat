import { useMutation } from "@tanstack/react-query";
import { httpClient } from "./httpClient";

export async function resetDB(): Promise<null> {
  const response = await httpClient.get("/reset_db");
  return response.data;
}

export function useResetDB() {
  return useMutation({
    mutationFn: () => resetDB(),
  });
}
