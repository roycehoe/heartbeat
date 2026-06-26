import { FormControl, FormErrorMessage, Link, Text } from "@chakra-ui/react";
import { Checkbox } from "@opengovsg/design-system-react";
import type { ChangeEventHandler } from "react";

function FormCheckboxTermsAndConditions(props: {
  value: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
  isDisabled: boolean;
  isInvalid: boolean;
  errorMessage?: string;
}) {
  return (
    <FormControl
      isRequired
      isInvalid={props.isInvalid}
      isDisabled={props.isDisabled}
      display="flex"
      flexDirection="column"
      gap="12px"
    >
      <Text>
        By checking the box below, I acknoledge that I have read and agreed to
        heartbeat's&nbsp;
        <Link
          href="/assets/HeartBeat-Data-Protection-Notice.pdf"
          target="_blank"
        >
          data protection notice
        </Link>
        &nbsp;and&nbsp;
        <Link href="/assets/HeartBeat-TOU.pdf" target="_blank">
          terms of use.
        </Link>
      </Text>
      <Checkbox isChecked={props.value} onChange={props.onChange}>
        Accept terms and conditions
      </Checkbox>
      <FormErrorMessage>{props.errorMessage}</FormErrorMessage>
    </FormControl>
  );
}

export default FormCheckboxTermsAndConditions;
