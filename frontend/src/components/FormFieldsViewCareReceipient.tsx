import { Box, FormControl, FormLabel, Input } from "@chakra-ui/react";
import type { CareReceipientDetailOut } from "@/api/types";

export function FormFieldsViewCareReceipient(props: {
  careReceipient: CareReceipientDetailOut;
  isShowPersonalInformation: boolean;
}) {
  const { careReceipient, isShowPersonalInformation } = props;
  const inputType = isShowPersonalInformation ? "password" : "text";

  const fields: { label: string; value: string }[] = [
    { label: "Name", value: careReceipient.name },
    { label: "Contact Number", value: careReceipient.contact_number },
    { label: "Age Range", value: careReceipient.age_range },
    { label: "Race", value: careReceipient.race },
    { label: "Gender", value: careReceipient.gender },
    { label: "Application Language", value: careReceipient.app_language },
    { label: "Postal Code", value: String(careReceipient.postal_code) },
    { label: "Floor", value: String(careReceipient.floor) },
    { label: "Block", value: careReceipient.block },
    { label: "Unit", value: careReceipient.unit ?? "" },
  ];

  return (
    <Box display="flex" flexDirection="column" gap="16px">
      {fields.map(({ label, value }) => (
        <FormControl key={label} isDisabled>
          <FormLabel>{label}</FormLabel>
          <Input
            isReadOnly
            type={inputType}
            value={value}
            size="xs"
            borderColor="slate.300"
          />
        </FormControl>
      ))}
    </Box>
  );
}
