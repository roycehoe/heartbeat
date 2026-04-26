import { CareReceipientDetailOut, SelectedMood } from "@/api/types";
import { CreateCareReceipientForm } from "@/pages/Caregiver/CreateCareReceipient";
import { UpdateCareReceipientForm } from "@/pages/Caregiver/UpdateCareReceipient";

export function getSubmitUpdateCareReceipientFormErrorMessage(
  userForm: UpdateCareReceipientForm
): string {
  if (!userForm.contactNumber) {
    return "Contact number is required.";
  }
  if (!/^\d+$/.test(userForm.contactNumber)) {
    return "Contact number must contain only digits.";
  }
  if (String(userForm.contactNumber).length !== 8) {
      console.log(userForm.contactNumber)
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

export function getSubmitCreateCareReceipientFormErrorMessage(
  userForm: CreateCareReceipientForm
): string {
  const errorMessage = getSubmitUpdateCareReceipientFormErrorMessage(userForm);
  if (errorMessage !== "") {
    return errorMessage;
  }
  if (!userForm.hasAgreedToTermsAndConditions) {
    return "You must agree to the terms and conditions.";
  }
  return "";
}
