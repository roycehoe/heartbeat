import { CreateUserForm } from "./CreateUser";

export function getSubmitCreateUpdateUserFormErrorMessage(
  createUserForm: CreateUserForm
): string {
  if (!createUserForm.email) {
    return "Email is required.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(createUserForm.email)) {
    return "Invalid email format.";
  }

  if (!createUserForm.password) {
    return "Password is required.";
  }
  if (createUserForm.password.length < 8) {
    return "Password must be at least 8 characters long.";
  }

  if (!createUserForm.confirmPassword) {
    return "Please confirm your password.";
  }
  if (createUserForm.password !== createUserForm.confirmPassword) {
    return "Passwords do not match.";
  }

  if (!createUserForm.contactNumber) {
    return "Contact number is required.";
  }
  if (!/^\d+$/.test(createUserForm.contactNumber)) {
    return "Contact number must contain only digits.";
  }
  if (createUserForm.contactNumber.length !== 8) {
    return "Contact number must contain exactly eight digits.";
  }

  if (!createUserForm.name) {
    return "Name is required.";
  }

  if (!createUserForm.age) {
    return "Age is required.";
  }

  if (!createUserForm.alias) {
    return "Alias is required.";
  }
  if (createUserForm.alias.length > 12) {
    return "Alias must be less than 12 characters.";
  }

  if (!createUserForm.postalCode) {
    return "Postal code is required.";
  } else if (!/^\d{6}$/.test(createUserForm.postalCode)) {
    return "Postal code must be 6 digits.";
  }

  if (!createUserForm.floor) {
    return "Floor is required.";
  }

  return "";
}
