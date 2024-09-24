import { httpClient } from "./httpClient";

export enum MoodValue {
  HAPPY = "happy",
  OK = "ok",
  SAD = "sad",
}

export enum TreeDisplayState {
  SEEDLING = 1,
  TEEN_TREE = 2,
  ADULT_TREE = 3,
  ADULT_TREE_WITH_FLOWERS = 4,
  ADULT_TREE_WITH_FLOWERS_AND_GIFTS = 5,
}

interface Mood {
  mood: MoodValue;
  user_id: number;
  created_at: string;
}

interface MoodRequest {
  mood: MoodValue;
}

export interface DashboardResponse {
  user_id: number;
  moods: Mood[];
  can_record_mood: boolean;
  coins: number;
  tree_display_state: TreeDisplayState;
  claimable_gifts: number;
  consecutive_checkins: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  token_type: string;
}

export async function getUserDashboardResponse(): Promise<DashboardResponse> {
  const response = await httpClient.get("/user/dashboard");
  return response.data;
}

export async function getUserMoodResponse(
  moodRequest: MoodRequest
): Promise<DashboardResponse> {
  const response = await httpClient.post("/user/mood", moodRequest);
  return response.data;
}

export async function getUserClaimGiftResponse(): Promise<DashboardResponse> {
  const response = await httpClient.get("/user/claim_gift");
  return response.data;
}

export async function getUserLoginResponse(
  loginRequest: LoginRequest
): Promise<LoginResponse> {
  const response = await httpClient.post("/user/log-in", loginRequest);
  return response.data;
}
