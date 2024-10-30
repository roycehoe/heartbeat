import { Gender, Race } from "../../api/user";
import { CreateUserForm } from "./CreateUser";

export interface CreateUpdateUserFormFieldProps {
  formLabel: string;
  isRequired: boolean;
  type: string;
  options: string[];
}

export const CREATE_UPDATE_USER_FORM_FIELDS_PROPS: Record<
  keyof CreateUserForm,
  CreateUpdateUserFormFieldProps
> = {
  email: {
    formLabel: "Email",
    isRequired: true,
    type: "email",
    options: [],
  },
  password: {
    formLabel: "Password",
    isRequired: true,
    type: "password",
    options: [],
  },
  confirmPassword: {
    formLabel: "Confirm Password",
    isRequired: true,
    type: "password",
    options: [],
  },
  contactNumber: {
    formLabel: "Contact Number",
    isRequired: true,
    type: "tel",
    options: [],
  },
  name: {
    formLabel: "Name",
    isRequired: true,
    type: "text",
    options: [],
  },
  age: {
    formLabel: "Age",
    isRequired: true,
    type: "number",
    options: [],
  },
  alias: {
    formLabel: "Alias",
    isRequired: true,
    type: "text",
    options: [],
  },
  race: {
    formLabel: "Race",
    isRequired: true,
    type: "select",
    options: [Race.CHINESE, Race.INDIAN, Race.MALAY, Race.OTHERS],
  },
  gender: {
    formLabel: "Gender",
    isRequired: true,
    type: "select",
    options: [Gender.MALE, Gender.FEMALE],
  },
  postalCode: {
    formLabel: "Postal Code",
    isRequired: true,
    type: "text",
    options: [],
  },
  floor: {
    formLabel: "Floor",
    isRequired: true,
    type: "text",
    options: [],
  },
};
