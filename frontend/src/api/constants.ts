import { AdminLoginRequest } from "./user";

export const DEFAULT_USER_CREDENTIALS: AdminLoginRequest[] = [
  { username: "user1@heartbeatmail.com", password: "user1@heartbeatmail.com" },
  { username: "user2@heartbeatmail.com", password: "user2@heartbeatmail.com" },
  { username: "user3@heartbeatmail.com", password: "user3@heartbeatmail.com" },
];

export const DEFAULT_ADMIN_CREDENTIALS: AdminLoginRequest = {
  username: "admin@heartbeatmail.com",
  password: "admin@heartbeatmail.com",
};
