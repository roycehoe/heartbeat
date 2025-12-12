import { Box, Text } from "@chakra-ui/react";
import { Button, Menu } from "@opengovsg/design-system-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DashboardResponse,
  getUserLoginResponse,
  useGetAdminDashboardResponse,
} from "../../api/user";
import { LogInFormState } from "./Index";

type CareReceipientSelectionFormProps = {
  setLogInFormState: (logInFormState: LogInFormState) => void;
};

function CareReceipientSelectionForm({
  setLogInFormState,
}: CareReceipientSelectionFormProps) {
  const { data, isLoading } = useGetAdminDashboardResponse();
  const [selectedCareReceipient, setSelectedCareReceipient] =
    useState<DashboardResponse | null>(null);
  const navigate = useNavigate();

  const onSignInButtonClick = async (userId: number) => {
    const response = await getUserLoginResponse({ user_id: userId });
    localStorage.setItem("token", response.access_token);
    navigate("/");
    setLogInFormState(LogInFormState.CaregiverOrCareReceipientSelection);
  };

  if (isLoading) {
    return (
      <Box>
        <Text>Loading your care receipients...</Text>
      </Box>
    );
  }
  if (!!!data?.data) {
    return (
      <Box>
        <Text>Something went wrong</Text>
      </Box>
    );
  }

  const careReceipients = data.data;

  return (
    <Box display="flex" flexDirection="column" gap="24px">
      <Box display="flex" flexDirection="column" gap="12px">
        <Menu>
          <Menu.Button variant="outline">
            {selectedCareReceipient?.alias ?? "Select a care receipient"}
          </Menu.Button>

          <Menu.List>
            {careReceipients.length === 0 ? (
              <Menu.Item isDisabled>No care receipients found</Menu.Item>
            ) : (
              careReceipients.map((careReceipient: DashboardResponse) => (
                <Menu.Item
                  key={careReceipient.user_id}
                  onClick={() => setSelectedCareReceipient(careReceipient)}
                >
                  {careReceipient.alias}
                </Menu.Item>
              ))
            )}
          </Menu.List>
        </Menu>
      </Box>

      <Box display="flex" flexDirection="column" gap="12px">
        <Button
          width="100%"
          isDisabled={!!!selectedCareReceipient}
          onClick={() => onSignInButtonClick(selectedCareReceipient?.user_id)}
        >
          <Text>Sign in</Text>
        </Button>
        <Button
          width="100%"
          onClick={() =>
            setLogInFormState(LogInFormState.CaregiverOrCareReceipientSelection)
          }
        >
          <Text>Go back</Text>
        </Button>
      </Box>
    </Box>
  );
}

export default CareReceipientSelectionForm;
