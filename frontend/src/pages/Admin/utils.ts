import { DashboardResponse, MoodValue } from "../../api/user";
import { CreateUserForm } from "./CreateUser";
import { UpdateUserForm } from "./UpdateUser";

export function getSubmitUpdateUserFormErrorMessage(
  userForm: UpdateUserForm
): string {
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
