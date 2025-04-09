import { DashboardResponse, MoodValue } from "../../api/user";
import { CreateUserForm } from "./CreateUser";
import { UpdateUserForm } from "./UpdateUser";

export function getSubmitUpdateUserFormErrorMessage(
  userForm: UpdateUserForm
): string {
  if (!userForm.username) {
    return "Username is required.";
  }

  if (!userForm.password) {
    return "Password is required.";
  }
  if (userForm.password.length < 8) {
    return "Password must be at least 8 characters long.";
  }

  if (!userForm.confirmPassword) {
    return "Please confirm your password.";
  }
  if (userForm.password !== userForm.confirmPassword) {
    return "Passwords do not match.";
  }

  if (!userForm.contactNumber) {
    return "Contact number is required.";
  }
  if (!/^\d+$/.test(userForm.contactNumber)) {
    return "Contact number must contain only digits.";
  }
  if (userForm.contactNumber.length !== 8) {
    return "Contact number must contain exactly eight digits.";
  }

  if (!userForm.name) {
    return "Name is required.";
  }

  if (!userForm.age) {
    return "Age is required.";
  }

  if (!userForm.alias) {
    return "Alias is required.";
  }
  if (userForm.alias.length > 12) {
    return "Alias must be less than 12 characters.";
  }

  if (!userForm.postalCode) {
    return "Postal code is required.";
  } else if (!/^\d{6}$/.test(userForm.postalCode)) {
    return "Postal code must be 6 digits.";
  }

  if (!userForm.floor) {
    return "Floor is required.";
  }

  return "";
}

export function getSubmitCreateUserFormErrorMessage(
  userForm: CreateUserForm
): string {
  const errorMessage = getSubmitUpdateUserFormErrorMessage(userForm);
  if (errorMessage !== "") {
    return errorMessage;
  }
  if (!userForm.hasAgreedToTermsAndConditions) {
    return "You must agree to the terms and conditions.";
  }
  return "";
}

export interface UserMoodDate {
  date: Date;
  mood: MoodValue | undefined;
}

export function getLastFourDaysMood(
  dashboardResponse: DashboardResponse
): UserMoodDate[] {
  const today = new Date();
  const results = [];

  for (let i = 0; i < 4; i++) {
    const day = new Date(today);
    day.setDate(today.getDate() - i);

    const dateStr = day.toISOString().split("T")[0];
    const moodRecord = dashboardResponse.moods.find((mood) =>
      mood.created_at.startsWith(dateStr)
    );

    results.push({
      date: day,
      mood: moodRecord ? moodRecord.mood : undefined,
    });
  }

  return results;
}
