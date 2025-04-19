import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { Button } from "@opengovsg/design-system-react";
import { useState } from "react";

function FormInputUserPassword(props: {
  field: string;
  isRequired: boolean;
  isDisabled: boolean;
  formLabel: string;
  type: string;
  value: string;
  onChange: (e: any, field: any) => void;
  placeholder: string;
}) {
  const [isShow, setIsShow] = useState(false);
  const handleClick = () => setIsShow(!isShow);

  return (
    <FormControl
      key={props.field}
      isRequired={props.isRequired}
      isDisabled={props.isDisabled}
    >
      <FormLabel>{props.formLabel}</FormLabel>
      <InputGroup>
        <Input
          type={isShow ? "text" : "password"}
          value={props.value}
          onChange={props.onChange}
          placeholder={props.placeholder}
          borderColor="slate.300"
          _placeholder={{ color: "gray.500" }}
        />
        <InputRightElement>
          <Button
            size="xs"
            marginRight="18px"
            padding="8px"
            variant="outline"
            onClick={handleClick}
          >
            {isShow ? "Hide" : "Show"}
          </Button>
        </InputRightElement>
      </InputGroup>
    </FormControl>
  );
}

export default FormInputUserPassword;
