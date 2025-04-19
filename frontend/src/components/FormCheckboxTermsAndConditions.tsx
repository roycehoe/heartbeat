import { Box, FormControl, Link, Text } from "@chakra-ui/react";
import { Checkbox } from "@opengovsg/design-system-react";

function FormCheckboxTermsAndConditions(props: {
  field: string;
  isRequired: boolean;
  isDisabled: boolean;
  formLabel: string;
  type: string;
  value: boolean;
  onChange: (e: any, field: any) => void;
  placeholder: string;
}) {
  return (
    <FormControl
      key={props.field}
      isRequired={props.isRequired}
      isDisabled={props.isDisabled}
      display="flex"
      flexDirection="column"
      gap="12px"
    >
      <Text>
        By checking the box below, I acknoledge that I have read and agreed to
        heartbeat's&nbsp;
        <Link
          href="src/assets/HeartBeat-Data-Protection-Notice.pdf"
          target="_blank"
        >
          data protection notice
        </Link>
        &nbsp;and&nbsp;
        <Link href="src/assets/HeartBeat-TOU.pdf" target="_blank">
          terms of use.
        </Link>
      </Text>
      <Checkbox isChecked={props.value} onChange={props.onChange}>
        Accept terms and conditions
      </Checkbox>
    </FormControl>
  );
}

export default FormCheckboxTermsAndConditions;
