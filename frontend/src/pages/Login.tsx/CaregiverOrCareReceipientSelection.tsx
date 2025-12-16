import { Box, Text } from "@chakra-ui/react";
import { useClerk } from "@clerk/clerk-react";
import { Button } from "@opengovsg/design-system-react";
import { useNavigate } from "react-router-dom";
import { LogInFormState } from "./Index";

function CaregiverOrCareReceipientSelection({
  setLogInFormState,
}: {
  setLogInFormState: (logInFormState: LogInFormState) => void;
}) {
  const navigate = useNavigate();
  const { signOut } = useClerk();

  const onLogInAsCaregiverButtonClick = () => {
    navigate("/admin");
  };
  const onLogInAsCareReceipientButtonClick = () => {
    setLogInFormState(LogInFormState.CareReceipientSelection);
  };
  const onGoBackButtonClick = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("clerk_token");
    signOut({ redirectUrl: "/login" });
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
        <Button width="100%" onClick={onGoBackButtonClick}>
          <Text>Go back</Text>
        </Button>
      </Box>
    </div>
  );
}

export default CaregiverOrCareReceipientSelection;
