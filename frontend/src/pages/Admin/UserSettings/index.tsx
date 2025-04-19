import {
  Box,
  Button,
  Heading,
  IconButton,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Banner } from "@opengovsg/design-system-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getDeleteUserResponse,
  getResetUserPasswordResponse,
  ResetUserPasswordRequest,
} from "../../../api/admin";
import { IconArrowLeft } from "../../../components/IconArrowLeft";
import ModalDeleteUser from "../../../components/ModalDeleteUser";
import ModalResetUserPassword from "../../../components/ModalResetUserPassword";

const UserSettings = () => {
  const { userId } = useParams();
  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] =
    useState<boolean>(false);
  const [isResetUserPasswordModalOpen, setIsResetUserPasswordModalOpen] =
    useState<boolean>(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleBackIconClick = (userName: string) => {
    navigate(`/admin/${userName}`);
  };

  const handleOnConfirmModalResetUserPassword = async (
    resetUserPasswordRequest: ResetUserPasswordRequest
  ) => {
    await getResetUserPasswordResponse(resetUserPasswordRequest);
    setIsResetUserPasswordModalOpen(false);
    toast({
      title: "Password Reset Complete",
      description: "This user's new password is now the same as their username",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
  };

  const handleOnConfirmModalDeleteUser = async (userId: number) => {
    await getDeleteUserResponse(userId);
    setIsDeleteUserModalOpen(false);
    toast({
      title: "User Deleted Successfully",
      description: "This user's account has been deleted successfully",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
    navigate(`/admin`);
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
            onClick={() => handleBackIconClick(userId)}
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
          <Button
            width="100%"
            onClick={() => setIsResetUserPasswordModalOpen(true)}
          >
            <Text>Reset user's password</Text>
          </Button>
          <Button
            width="100%"
            colorScheme="critical"
            onClick={() => setIsDeleteUserModalOpen(true)}
          >
            <Text>Delete user</Text>
          </Button>
          <ModalDeleteUser
            isOpen={isDeleteUserModalOpen}
            onClose={() => setIsDeleteUserModalOpen(false)}
            onConfirm={() => handleOnConfirmModalDeleteUser(Number(userId))}
          />
          <ModalResetUserPassword
            isOpen={isResetUserPasswordModalOpen}
            onClose={() => setIsResetUserPasswordModalOpen(false)}
            onConfirm={() =>
              handleOnConfirmModalResetUserPassword({
                user_id: Number(userId),
              })
            }
          />
        </Box>
      </Box>
    </Box>
  );
};

export default UserSettings;
