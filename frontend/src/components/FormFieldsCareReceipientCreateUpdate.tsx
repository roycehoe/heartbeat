import { Box } from "@chakra-ui/react";
import type { CreateUpdateCareReceipientFormFieldProps } from "@/pages/Caregiver/constants";
import type { CreateCareReceipientForm } from "@/pages/Caregiver/CreateCareReceipient";
import type { UpdateCareReceipientForm } from "@/pages/Caregiver/UpdateCareReceipient";
import FormCheckboxTermsAndConditions from "@/components/FormCheckboxTermsAndConditions";
import FormInputCareReceipient from "@/components/FormInputCareReceipient";
import FormSelectCareReceipient from "@/components/FormSelectCareReceipient";

function FormFieldsCareReceipientCreateUpdate(props: {
  createUpdateCareReceipientFormFields: Record<
    keyof CreateCareReceipientForm | keyof UpdateCareReceipientForm,
    CreateUpdateCareReceipientFormFieldProps
  >;
  createCareReceipientForm: CreateCareReceipientForm;
  setCreateCareReceipientForm: React.Dispatch<
    React.SetStateAction<CreateCareReceipientForm>
  >;
}) {
  const handleChange = (e, field) => {
    props.setCreateCareReceipientForm({
      ...props.createCareReceipientForm,
      [field]: e.target.value,
    });
  };

  const handleCheckboxChange = (e, field) => {
    props.setCreateCareReceipientForm({
      ...props.createCareReceipientForm,
      [field]: e.target.checked,
    });
  };

  return (
    <Box display="flex" flexDirection="column" gap="16px">
      {Object.keys(props.createUpdateCareReceipientFormFields).map((field) => {
        const { formLabel, isRequired, type, options, placeholder } =
          props.createUpdateCareReceipientFormFields[field];

        if (type === "select") {
          return (
            <FormSelectCareReceipient
              field={field}
              isRequired={isRequired}
              isDisabled={false}
              formLabel={formLabel}
              type={type}
              value={props.createCareReceipientForm[field]}
              onChange={(e) => handleChange(e, field)}
              placeholder={placeholder}
              options={options}
            ></FormSelectCareReceipient>
          );
        }
        if (type === "checkbox") {
          return (
            <FormCheckboxTermsAndConditions
              field={field}
              isRequired={isRequired}
              formLabel={formLabel}
              type={type}
              value={props.createCareReceipientForm[field]}
              onChange={(e) => handleCheckboxChange(e, field)}
              placeholder={formLabel}
            ></FormCheckboxTermsAndConditions>
          );
        }

        return (
          <FormInputCareReceipient
            field={field}
            isRequired={isRequired}
            formLabel={formLabel}
            type={type}
            value={props.createCareReceipientForm[field]}
            onChange={(e) => handleChange(e, field)}
            placeholder={placeholder}
          ></FormInputCareReceipient>
        );
      })}
    </Box>
  );
}

export default FormFieldsCareReceipientCreateUpdate;
