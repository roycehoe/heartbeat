import { httpClient } from "./httpClient";

enum MoodValue {
  HAPPY = "happy",
  OK = "ok",
  SAD = "sad",
}

enum TreeDisplayState {
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

interface DashboardResponse {
  user_id: number;
  moods: Mood[];
  can_record_mood: boolean;
  coins: number;
  tree_display_state: TreeDisplayState;
  can_claim_gifts: boolean;
  consecutive_checkins: number;
}

export async function getUserDashboardResponse(
  token: string
): Promise<DashboardResponse> {
  const response = await httpClient.get("/user/dashboard", {
    headers: {
      token: `${token}`,
    },
  });
  return response.data;
}

export async function getUserMoodResponse(
  token: string,
  moodRequest: MoodRequest
): Promise<DashboardResponse> {
  const response = await httpClient.post("/user", moodRequest, {
    headers: {
      token: `${token}`,
    },
  });
  return response.data;
}

export async function getUserClaimGiftResponse(
  token: string
): Promise<DashboardResponse> {
  const response = await httpClient.get("/user/claim_gift", {
    headers: {
      token: `${token}`,
    },
  });
  return response.data;
}
