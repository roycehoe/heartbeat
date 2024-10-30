import { FormControl, FormLabel, Input } from "@chakra-ui/react";

function FormInputUser(props: {
  field: string;
  isRequired: boolean;
  formLabel: string;
  type: string;
  value: string;
  onChange: (e: any, field: any) => void;
  placeholder: string;
}) {
  return (
    <FormControl key={props.field} isRequired={props.isRequired}>
      <FormLabel>{props.formLabel}</FormLabel>
      <Input
        type={props.type}
        value={props.value}
        onChange={props.onChange}
        placeholder={props.placeholder}
        size="xs"
        borderColor="slate.300"
        _placeholder={{ color: "gray.500" }}
      />
    </FormControl>
  );
}

export default FormInputUser;
