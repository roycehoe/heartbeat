export enum MoodValue {
  HAPPY = "happy",
  OK = "ok",
  SAD = "sad",
}

export enum Race {
  CHINESE = "Chinese",
  MALAY = "Malay",
  INDIAN = "Indian",
  OTHERS = "Others",
}

export enum Gender {
  MALE = "Male",
  FEMALE = "Female",
}

export enum AppLanguage {
  ENGLISH = "English",
  CHINESE = "Chinese",
}

export interface Mood {
  mood: MoodValue | undefined;
  user_id: number;
  created_at: string;
}

export interface MoodRequest {
  mood: MoodValue;
}

export interface DashboardResponse {
  user_id: number;
  name: string;
  alias: string;
  age: number;
  race: Race;
  gender: Gender;
  postal_code: number;
  floor: number;
  block: string;
  unit: string;
  contact_number: number;
  is_suspended: boolean;

  moods: Mood[];
  can_record_mood: boolean;
  consecutive_checkins: number;
  consecutive_non_checkins: number;
}

export interface MoodResponse extends DashboardResponse {
  mood_message: string;
}

export interface UserLoginRequest {
  user_id: number;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface CreateUserRequest {
  contactNumber: number;
  name: string;
  age: number;
  alias: string;
  race: Race;
  appLanguage: AppLanguage;
  gender: Gender;
  postalCode: number;
  floor: number;
  block: string;
  unit: string;
}

export interface SignUpAdminRequest {
  clerk_id: string;
  contactNumber: number;
}

export interface UpdateUserRequest extends CreateUserRequest {}
