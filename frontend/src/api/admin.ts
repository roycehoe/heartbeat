import { httpClient } from "./httpClient";
import { Gender, Race } from "./user";

export interface CreateUserRequest {
  username: string;
  password: string;
  confirmPassword: string;
  contactNumber: number;
  name: string;
  age: number;
  alias: string;
  race: Race;
  gender: Gender;
  postalCode: number;
  floor: number;
}

export interface UpdateUserRequest extends CreateUserRequest {}

export async function getCreateUserResponse(
  createUserRequest: CreateUserRequest
): Promise<null> {
  const response = await httpClient.post("/admin/user", createUserRequest);
  return response.data;
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
