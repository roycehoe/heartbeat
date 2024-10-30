import { Box } from "@chakra-ui/react";
import { CreateUpdateUserFormFieldProps } from "../pages/Admin/constants";
import { CreateUserForm } from "../pages/Admin/CreateUser";
import FormInputUser from "./FormInputUser";
import FormInputUserPassword from "./FormInputUserPassword";
import FormSelectUser from "./FormSelectUser";

function FormFieldsUserCreateUpdate(props: {
  createUpdateUserFormFields: Record<
    keyof CreateUserForm,
    CreateUpdateUserFormFieldProps
  >;
  createUserForm: CreateUserForm;
  setCreateUserForm: React.Dispatch<React.SetStateAction<CreateUserForm>>;
}) {
  const handleChange = (e, field) => {
    props.setCreateUserForm({
      ...props.createUserForm,
      [field]: e.target.value,
    });
  };

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
              formLabel={formLabel}
              type={type}
              value={props.createUserForm[field]}
              onChange={(e) => handleChange(e, field)}
              placeholder={formLabel}
              options={options}
            ></FormSelectUser>
          );
        }
        if (type === "password") {
          return (
            <FormInputUserPassword
              field={field}
              isRequired={isRequired}
              formLabel={formLabel}
              type={type}
              value={props.createUserForm[field]}
              onChange={(e) => handleChange(e, field)}
              placeholder={formLabel}
            ></FormInputUserPassword>
          );
        }

        return (
          <FormInputUser
            field={field}
            isRequired={isRequired}
            formLabel={formLabel}
            type={type}
            value={props.createUserForm[field]}
            onChange={(e) => handleChange(e, field)}
            placeholder={formLabel}
          ></FormInputUser>
        );
      })}
    </Box>
  );
}

export default FormFieldsUserCreateUpdate;
