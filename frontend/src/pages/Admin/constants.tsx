import { AppLanguage, Gender, Race } from "../../api/user";
import { CreateUserForm } from "./CreateUser";
import { UpdateUserForm } from "./UpdateUser";

export interface CreateUpdateUserFormFieldProps {
  formLabel: string;
  isRequired: boolean;
  type: string;
  options: string[];
  placeholder: string;
}

export const UPDATE_USER_FORM_FIELDS_PROPS: Record<
  keyof UpdateUserForm,
  CreateUpdateUserFormFieldProps
> = {
  username: {
    formLabel: "Username",
    isRequired: true,
    type: "text",
    options: [],
    placeholder: "",
  },
  password: {
    formLabel: "Password",
    isRequired: true,
    type: "password",
    options: [],
    placeholder: "",
  },
  confirmPassword: {
    formLabel: "Confirm Password",
    isRequired: true,
    type: "password",
    options: [],
    placeholder: "",
  },
  contactNumber: {
    formLabel: "Contact Number",
    isRequired: true,
    type: "tel",
    options: [],
    placeholder: "91234567",
  },
  name: {
    formLabel: "Name",
    isRequired: true,
    type: "text",
    options: [],
    placeholder: "Lin Junjie",
  },
  age: {
    formLabel: "Age",
    isRequired: true,
    type: "number",
    options: [],
    placeholder: "67",
  },
  alias: {
    formLabel: "Alias",
    isRequired: true,
    type: "text",
    options: [],
    placeholder: "JJ",
  },
  race: {
    formLabel: "Race",
    isRequired: true,
    type: "select",
    options: [Race.CHINESE, Race.INDIAN, Race.MALAY, Race.OTHERS],
    placeholder: Race.CHINESE,
  },
  gender: {
    formLabel: "Gender",
    isRequired: true,
    type: "select",
    options: [Gender.MALE, Gender.FEMALE],
    placeholder: Gender.MALE,
  },
  appLanguage: {
    formLabel: "Application Language",
    isRequired: true,
    type: "select",
    options: [AppLanguage.ENGLISH, AppLanguage.CHINESE],
    placeholder: AppLanguage.ENGLISH,
  },
  postalCode: {
    formLabel: "Postal Code",
    isRequired: true,
    type: "text",
    options: [],
    placeholder: "189554",
  },
  floor: {
    formLabel: "Floor",
    isRequired: true,
    type: "text",
    options: [],
    placeholder: "4",
  },
  block: {
    formLabel: "Block",
    isRequired: true,
    type: "text",
    options: [],
    placeholder: "123B",
  },
  unit: {
    formLabel: "Unit",
    isRequired: true,
    type: "text",
    options: [],
    placeholder: "#04-08",
  },
};

export const VIEW_USER_FORM_FIELDS_PROPS: Record<
  keyof UpdateUserForm,
  CreateUpdateUserFormFieldProps
> = {
  username: {
    formLabel: "Username",
    isRequired: true,
    type: "text",
    options: [],
    placeholder: "",
  },
  contactNumber: {
    formLabel: "Contact Number",
    isRequired: true,
    type: "tel",
    options: [],
    placeholder: "eg. 91234567",
  },
  name: {
    formLabel: "Name",
    isRequired: true,
    type: "text",
    options: [],
    placeholder: "Lin Junjie",
  },
  age: {
    formLabel: "Age",
    isRequired: true,
    type: "number",
    options: [],
    placeholder: "67",
  },
  alias: {
    formLabel: "Alias",
    isRequired: true,
    type: "text",
    options: [],
    placeholder: "JJ",
  },
  race: {
    formLabel: "Race",
    isRequired: true,
    type: "select",
    options: [Race.CHINESE, Race.INDIAN, Race.MALAY, Race.OTHERS],
    placeholder: Race.CHINESE,
  },
  gender: {
    formLabel: "Gender",
    isRequired: true,
    type: "select",
    options: [Gender.MALE, Gender.FEMALE],
    placeholder: Gender.MALE,
  },
  appLanguage: {
    formLabel: "Application Language",
    isRequired: true,
    type: "select",
    options: [AppLanguage.ENGLISH, AppLanguage.CHINESE],
    placeholder: AppLanguage.ENGLISH,
  },
  postalCode: {
    formLabel: "Postal Code",
    isRequired: true,
    type: "text",
    options: [],
    placeholder: "eg. 189554",
  },
  floor: {
    formLabel: "Floor",
    isRequired: true,
    type: "text",
    options: [],
    placeholder: "4",
  },
  block: {
    formLabel: "Block",
    isRequired: true,
    type: "text",
    options: [],
    placeholder: "123B",
  },
  unit: {
    formLabel: "Unit",
    isRequired: true,
    type: "text",
    options: [],
    placeholder: "#04-08",
  },
};

export const CREATE_USER_FORM_FIELDS_PROPS: Record<
  keyof CreateUserForm,
  CreateUpdateUserFormFieldProps
> = {
  ...UPDATE_USER_FORM_FIELDS_PROPS,
  hasAgreedToTermsAndConditions: {
    formLabel: "Terms and Conditions",
    isRequired: true,
    type: "checkbox",
    options: [],
  },
};
