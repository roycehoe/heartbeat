import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import { httpClient } from "./httpClient";

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

interface MoodRequest {
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
}

interface MoodResponse extends DashboardResponse {
  mood_message: string;
}

export interface UserLoginRequest {
  user_id: number;
}

export interface AdminLoginRequest {
  clerk_id: string;
}

interface LoginResponse {
  access_token: string;
  token_type: string;
}

export async function getUserDashboardResponse(): Promise<
  AxiosResponse<DashboardResponse>
> {
  return await httpClient.get("/user/dashboard");
}

export function useGetUserDashboardResponse() {
  return useQuery({
    queryKey: ["getUserDashboardResponse"],
    queryFn: () => getUserDashboardResponse(),
    refetchInterval: 60 * 60 * 1000, // auto-refetch every hour
  });
}

export async function getAdminDashboardResponse(): Promise<
  AxiosResponse<DashboardResponse[]>
> {
  return await httpClient.get("/admin/dashboard");
}

export function useGetAdminDashboardResponse() {
  return useQuery({
    queryKey: ["getAdminDashboardResponse"],
    queryFn: () => getAdminDashboardResponse(),
  });
}

export async function getUserMoodResponse(
  moodRequest: MoodRequest
): Promise<MoodResponse> {
  const response = await httpClient.post("/user/mood", moodRequest);
  return response.data;
}

export async function getUserClaimGiftResponse(): Promise<DashboardResponse> {
  const response = await httpClient.get("/user/claim_gift");
  return response.data;
}

export async function getUserLoginResponse(
  loginRequest: UserLoginRequest
): Promise<LoginResponse> {
  const response = await httpClient.post("/user/login", loginRequest);
  return response.data;
}

async function getAdminLoginResponse(
  loginRequest: AdminLoginRequest
): Promise<LoginResponse> {
  const response = await httpClient.post("/admin/login", loginRequest);
  return response.data;
}

export function useGetAdminLoginRespose(user: { id?: string } | null) {
  return useQuery({
    queryKey: ["adminLogin", user?.id],
    enabled: !!user?.id,
    queryFn: () => getAdminLoginResponse({ clerk_id: user!.id! }),
    retry: 1,
  });
}

export async function resetDB(): Promise<null> {
  const response = await httpClient.get("/reset_db");
  return response.data;
}
