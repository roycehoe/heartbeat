import { Box } from "@chakra-ui/react";
import { CreateUpdateUserFormFieldProps } from "../pages/Admin/constants";
import { CreateUserForm } from "../pages/Admin/CreateUser";
import { UpdateUserForm } from "../pages/Admin/UpdateUser";
import FormInputUser from "./FormInputUser";
import FormSelectUser from "./FormSelectUser";

export function FormFieldsViewUser(props: {
  createUpdateUserFormFields: Record<
    keyof CreateUserForm | keyof UpdateUserForm,
    CreateUpdateUserFormFieldProps
  >;
  createUserForm: CreateUserForm;
  isShowPersonalInformation: boolean;
}) {
  return (
    <Box display="flex" flexDirection="column" gap="16px">
      {Object.keys(props.createUpdateUserFormFields).map((field) => {
        const { formLabel, isRequired, type, options } =
          props.createUpdateUserFormFields[field];

        if (type === "select") {
          return (
            <FormSelectUser
              field={field}
              isRequired={isRequired}
              isDisabled={true}
              formLabel={formLabel}
              type={props.isShowPersonalInformation ? "password" : type}
              value={props.createUserForm[field]}
              onChange={(e) => handleChange(e, field)}
              placeholder={formLabel}
              options={options}
            ></FormSelectUser>
          );
        }
        return (
          <FormInputUser
            field={field}
            isRequired={isRequired}
            isDisabled={true}
            formLabel={formLabel}
            type={props.isShowPersonalInformation ? "password" : type}
            value={props.createUserForm[field]}
            onChange={(e) => handleChange(e, field)}
            placeholder={formLabel}
          ></FormInputUser>
        );
      })}
    </Box>
  );
}
