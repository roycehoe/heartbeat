import { FormControl, FormLabel, Select } from "@chakra-ui/react";

function FormSelectUser(props: {
  field: string;
  isRequired: boolean;
  formLabel: string;
  type: string;
  value: string;
  onChange: (e: any, field: any) => void;
  placeholder: string;
  options: string[];
}) {
  return (
    <FormControl key={props.field} isRequired={props.isRequired}>
      <FormLabel>{props.formLabel}</FormLabel>
      <Select variant="outline">
        {props.options.map((option) => {
          return <option value={option}>{option}</option>;
        })}
      </Select>
    </FormControl>
  );
}

export default FormSelectUser;
