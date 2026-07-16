export enum SelectedMood {
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
  MALAY = "Malay",
  TAMIL = "Tamil",
}

export enum AgeRange {
  UNDER_45 = "<45",
  R45_54 = "45-54",
  R55_64 = "55-64",
  R65_74 = "65-74",
  R75_84 = "75-84",
  R85_PLUS = "85+",
}

export interface CareReceipientDetailMoodOut {
  mood: SelectedMood | undefined;
  care_receipient_id: number;
  created_at: string;
}

export interface CareReceipientMoodRequest {
  mood: SelectedMood;
}

export interface CareReceipientDetailOut {
  care_receipient_id: number;
  name: string;
  age_range: AgeRange;
  race: Race;
  gender: Gender;
  postal_code: number;
  floor: number;
  block: string;
  unit?: string;
  contact_number: string;
  is_suspended: boolean;
  app_language: AppLanguage;

  moods: CareReceipientDetailMoodOut[];
  can_record_mood: boolean;
  consecutive_checkins: number;
  consecutive_non_checkins: number;
}

export interface CareReceipientMoodOut extends CareReceipientDetailOut {
  mood_message: string;
}

export interface CareReceipientDashboardMoodOut {
  mood: SelectedMood | undefined;
  created_at: string;
}

export interface CareReceipientDashboardOut {
  care_receipient_id: number;
  app_language: AppLanguage;
  moods: CareReceipientDashboardMoodOut[];
  can_record_mood: boolean;
  consecutive_checkins: number;
}

export interface CareReceipientToken {
  access_token: string;
  token_type: string;
}

export interface CaregiverToken {
  access_token: string;
  token_type: string;
}

export interface CareReceipientCreateRequest {
  contactNumber: string;
  name: string;
  age_range: AgeRange;
  race: Race;
  appLanguage: AppLanguage;
  gender: Gender;
  postalCode: number;
  floor: number;
  block: string;
  unit?: string;
}

export interface CaregiverCreateRequest {
  clerk_id: string;
  contactNumber: string;
}

export interface CareReceipientUpdateRequest extends CareReceipientCreateRequest {}

export interface CareReceipientLoginUrlResponse {
  url: string;
}

export interface MagicLinkVerifyRequest {
  token: string;
}
