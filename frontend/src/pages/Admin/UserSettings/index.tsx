import { Box, Button, Heading, IconButton, Text } from "@chakra-ui/react";
import { Banner } from "@opengovsg/design-system-react";
import { useNavigate, useParams } from "react-router-dom";
import { IconArrowLeft } from "../../../components/IconArrowLeft";

const UserSettings = () => {
  const { userName } = useParams();
  const navigate = useNavigate();

  const handleBackIconClick = (userName: string) => {
    navigate(`/admin/${userName}`);
  };

  return (
    <Box
      width="100%"
      height="100%"
      display="flex"
      flexDirection="column"
      className="page"
    >
      <Box
        className="page"
        margin="18px"
        display="flex"
        flexDir="column"
        gap="24px"
      >
        <Box display="flex" gap="8px" justifyContent="space-between">
          <IconButton
            onClick={() => handleBackIconClick(userName)}
            isRound={true}
            variant="solid"
            aria-label="Done"
            icon={<IconArrowLeft />}
          />
        </Box>
        <Box display="flex" gap="4px">
          <Heading size="sm">Auto-reminders</Heading>
          <img height="18px" width="18px" src="/assets/icon/edit.svg" />
        </Box>
        <Banner size="sm" variant="warn">
          1:00PM daily if no user input
        </Banner>

        <Box display="flex" gap="12px" flexDirection="column">
          <Button width="100%">
            <Text>Reset user's password</Text>
          </Button>
          <Button width="100%" colorScheme="critical">
            <Text>Remove user</Text>
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default UserSettings;
