import { Box, Heading, IconButton, Text } from "@chakra-ui/react";
import { useClerk } from "@clerk/clerk-react";
import { Button } from "@opengovsg/design-system-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconArrowLeft } from "../../../components/IconArrowLeft";
import ModalLogOut from "../../../components/ModalLogout";

export function Settings() {
  const navigate = useNavigate();
  const { signOut } = useClerk();

  const handleBackIconClick = () => {
    navigate(`/admin`);
  };
  const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("clerk_token");
    signOut({ redirectUrl: "/login" });
  };

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  return (
    <Box
      width="100%"
      height="100%"
      display="flex"
      flexDirection="column"
      className="page"
      justifyContent="space-between"
    >
      <Box
        className="page"
        margin="18px"
        paddingBottom="24px"
        display="flex"
        flexDir="column"
        gap="24px"
      >
        <Box display="flex" gap="8px" justifyContent="space-between">
          <IconButton
            onClick={handleBackIconClick}
            isRound={true}
            variant="solid"
            aria-label="Done"
            icon={<IconArrowLeft />}
          />
        </Box>
      </Box>
      <Box
        className="page"
        margin="18px"
        paddingBottom="24px"
        display="flex"
        flexDir="column"
        gap="24px"
      >
        <Button
          width="100%"
          colorScheme="critical"
          onClick={() => setIsLogoutModalOpen(true)}
        >
          <Text>Log out</Text>
        </Button>
      </Box>
      <ModalLogOut
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={logoutUser}
      ></ModalLogOut>
    </Box>
  );
}
