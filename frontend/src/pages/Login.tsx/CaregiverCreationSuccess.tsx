import { Box, Text } from "@chakra-ui/react";
import { Button } from "@opengovsg/design-system-react";
import { LogInFormState } from "./Index";

function CaregiverCreationSuccess({
  setLogInFormState,
}: {
  setLogInFormState: (logInFormState: LogInFormState) => void;
}) {
  return (
    <Box display="flex" flexDirection="column" gap="12px">
      <Text fontWeight="600" fontSize="18px">
        Account created!
      </Text>
      <Button
        width="100%"
        onClick={() => {
          setLogInFormState(LogInFormState.CaregiverAuthenticate);
        }}
      >
        <Text>Go back</Text>
      </Button>
    </Box>
  );
}

export default CaregiverCreationSuccess;
