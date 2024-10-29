import { DashboardResponse, LoginRequest } from "./user";

export const MOCK_DASHBOARD_API_RESPONSE: DashboardResponse = {
  user_id: 1,
  moods: [
    {
      mood: "happy",
      user_id: 1,
      created_at: "2024-09-23T09:38:20.472893",
    },
    {
      mood: "happy",
      user_id: 1,
      created_at: "2024-09-22T09:38:20.472893",
    },
    {
      mood: "happy",
      user_id: 1,
      created_at: "2024-09-21T09:38:20.472893",
    },
    {
      mood: "happy",
      user_id: 1,
      created_at: "2024-09-20T09:38:20.472893",
    },
    {
      mood: "happy",
      user_id: 1,
      created_at: "2024-09-19T09:38:20.472893",
    },
    {
      mood: "happy",
      user_id: 1,
      created_at: "2024-09-18T09:38:20.472893",
    },
    {
      mood: "ok",
      user_id: 1,
      created_at: "2024-09-17T09:38:20.472893",
    },
    {
      mood: "happy",
      user_id: 1,
      created_at: "2024-09-16T09:38:20.472893",
    },
    {
      mood: "ok",
      user_id: 1,
      created_at: "2024-09-15T09:38:20.472893",
    },
    {
      mood: "happy",
      user_id: 1,
      created_at: "2024-09-14T09:38:20.472893",
    },
    {
      mood: "ok",
      user_id: 1,
      created_at: "2024-09-13T09:38:20.472893",
    },
    {
      mood: "ok",
      user_id: 1,
      created_at: "2024-09-12T09:38:20.472893",
    },
    {
      mood: "happy",
      user_id: 1,
      created_at: "2024-09-11T09:38:20.472893",
    },
    {
      mood: "happy",
      user_id: 1,
      created_at: "2024-09-10T09:38:20.472893",
    },
    {
      mood: "happy",
      user_id: 1,
      created_at: "2024-09-09T09:38:20.472893",
    },
    {
      mood: "ok",
      user_id: 1,
      created_at: "2024-09-08T09:38:20.472893",
    },
    {
      mood: "ok",
      user_id: 1,
      created_at: "2024-09-07T09:38:20.472893",
    },
    {
      mood: "happy",
      user_id: 1,
      created_at: "2024-09-06T09:38:20.472893",
    },
    {
      mood: "happy",
      user_id: 1,
      created_at: "2024-09-05T09:38:20.472893",
    },
    {
      mood: "happy",
      user_id: 1,
      created_at: "2024-09-04T09:38:20.472893",
    },
    {
      mood: "ok",
      user_id: 1,
      created_at: "2024-09-03T09:38:20.472893",
    },
    {
      mood: "happy",
      user_id: 1,
      created_at: "2024-09-02T09:38:20.472893",
    },
    {
      mood: "ok",
      user_id: 1,
      created_at: "2024-09-01T09:38:20.472893",
    },
    {
      mood: "ok",
      user_id: 1,
      created_at: "2024-08-31T09:38:20.472893",
    },
  ],
  can_record_mood: true,
  coins: 0,
  tree_display_state: 5,
  claimable_gifts: 3,
  consecutive_checkins: 5,
};

export const DEFAULT_USER_CREDENTIALS: LoginRequest[] = [
  { email: "user1@heartbeatmail.com", password: "user1@heartbeatmail.com" },
  { email: "user2@heartbeatmail.com", password: "user2@heartbeatmail.com" },
  { email: "user3@heartbeatmail.com", password: "user3@heartbeatmail.com" },
];

export const DEFAULT_ADMIN_CREDENTIALS: LoginRequest = {
  email: "admin@heartbeatmail.com",
  password: "admin@heartbeatmail.com",
};
