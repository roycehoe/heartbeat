import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { httpClient } from "./httpClient";
import { AppLanguage, DashboardResponse, Gender, Race } from "./user";

export interface CreateUserRequest {
  username: string;
  password: string;
  confirmPassword: string;
  contactNumber: number;
  name: string;
  age: number;
  alias: string;
  race: Race;
  appLanguage: AppLanguage;
  gender: Gender;
  postalCode: number;
  floor: number;
}

export interface ResetUserPasswordRequest {
  user_id: number;
}

export interface UpdateUserRequest extends CreateUserRequest {}

export async function getCreateUserResponse(
  createUserRequest: CreateUserRequest
): Promise<AxiosResponse<null>> {
  return await httpClient.post("/admin/user", createUserRequest);
}

export function useGetCreateNewUser() {
  return useMutation({
    mutationFn: (request: CreateUserRequest) => getCreateUserResponse(request),
  });
}

export async function getDeleteUserResponse(userId: number): Promise<null> {
  const response = await httpClient.delete(`/admin/user/${userId}`);
  return response.data;
}

export async function getResetUserPasswordResponse(
  resetUserPasswordRequest: ResetUserPasswordRequest
): Promise<null> {
  const response = await httpClient.post(
    `/admin/user/reset-password`,
    resetUserPasswordRequest
  );
  return response.data;
}

export async function getAdminUserResponse(
  userId: number
): Promise<DashboardResponse> {
  const response = await httpClient.get(`/admin/user/${userId}`);
  return response.data;
}

export function useGetAdminUserResponse(userId: number) {
  return useQuery({
    queryKey: ["getAdminDashboardResponse"],
    queryFn: () => getAdminUserResponse(userId),
  });
}

export async function getUpdateUserResponse(
  userId: number,
  createUserRequest: CreateUserRequest
): Promise<null> {
  const response = await httpClient.put(
    `/admin/user/${userId}`,
    createUserRequest
  );
  return response.data;
}

export async function getSuspendUserResponse(userId: number): Promise<null> {
  const response = await httpClient.put(`/admin/user/${userId}/suspend`);
  return response.data;
}

export async function getUnsuspendUserResponse(userId: number): Promise<null> {
  const response = await httpClient.put(`/admin/user/${userId}/unsuspend`);
  return response.data;
}
