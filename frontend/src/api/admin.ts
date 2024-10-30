import { httpClient } from "./httpClient";
import { Gender, Race } from "./user";

export interface CreateUserRequest {
  email: string;
  password: string;
  confirmPassword: string;
  contactNumber: string;
  name: string;
  age: string;
  alias: string;
  race: Race;
  gender: Gender;
  postalCode: string;
  floor: string;
}

export async function getCreateUserResponse(
  createUserRequest: CreateUserRequest
): Promise<null> {
  const response = await httpClient.post("/admin/user", createUserRequest);
  return response.data;
}
