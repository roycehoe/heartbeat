import { Box } from "@chakra-ui/react";
import { CreateUpdateCareReceipientFormFieldProps } from "../pages/Caregiver/constants";
import { CreateCareReceipientForm } from "../pages/Caregiver/CreateCareReceipient";
import { UpdateCareReceipientForm } from "../pages/Caregiver/UpdateCareReceipient";
import FormInputCareReceipient from "./FormInputCareReceipient";
import FormSelectCareReceipient from "./FormSelectCareReceipient";

export function FormFieldsViewCareReceipient(props: {
  createUpdateCareReceipientFormFields: Record<
    keyof CreateCareReceipientForm | keyof UpdateCareReceipientForm,
    CreateUpdateCareReceipientFormFieldProps
  >;
  createCareReceipientForm: CreateCareReceipientForm;
  isShowPersonalInformation: boolean;
}) {
  const handleChange = () => {};

  return (
    <Box display="flex" flexDirection="column" gap="16px">
      {Object.keys(props.createUpdateCareReceipientFormFields).map((field) => {
        const { formLabel, isRequired, type, options } =
          props.createUpdateCareReceipientFormFields[field];

        if (type === "select") {
          return (
            <FormSelectCareReceipient
              field={field}
              isRequired={isRequired}
              isDisabled={true}
              formLabel={formLabel}
              type={props.isShowPersonalInformation ? "password" : type}
              value={props.createCareReceipientForm[field]}
              onChange={(e) => handleChange(e, field)}
              placeholder={formLabel}
              options={options}
            ></FormSelectCareReceipient>
          );
        }
        return (
          <FormInputCareReceipient
            field={field}
            isRequired={isRequired}
            isDisabled={true}
            formLabel={formLabel}
            type={props.isShowPersonalInformation ? "password" : type}
            value={props.createCareReceipientForm[field]}
            onChange={(e) => handleChange(e, field)}
            placeholder={formLabel}
          ></FormInputCareReceipient>
        );
      })}
    </Box>
  );
}
