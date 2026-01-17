import { Box, Text } from "@chakra-ui/react";
import { Button } from "@opengovsg/design-system-react";
import { Link, useNavigate } from "react-router-dom";
import { LogInFormState } from "./Index";

function CaregiverOrCareReceipientSelection({
  setLogInFormState,
}: {
  setLogInFormState: (logInFormState: LogInFormState) => void;
}) {
  const navigate = useNavigate();

  const onLogInAsCaregiverButtonClick = () => {
    navigate("/admin");
  };
  const onLogInAsCareReceipientButtonClick = () => {
    setLogInFormState(LogInFormState.CareReceipientSelection);
  };

  return (
    <div>
      <Box display="flex" flexDirection="column" gap="60px">
        <Box display="flex" flexDirection="column" gap="12px">
          <Button width="100%" onClick={onLogInAsCaregiverButtonClick}>
            <Text>Log in as Caregiver</Text>
          </Button>
          <Button width="100%" onClick={onLogInAsCareReceipientButtonClick}>
            <Text>Log in as Care Receipient</Text>
          </Button>
        </Box>
        <Link to="https://my.carecompass.sg/">
          <Button width="100%">Go Back</Button>
        </Link>
      </Box>
    </div>
  );
}

export default CaregiverOrCareReceipientSelection;
