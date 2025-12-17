import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Switch,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Banner } from "@opengovsg/design-system-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getDeleteUserResponse,
  getSuspendUserResponse,
  getUnsuspendUserResponse,
  useGetAdminUserResponse,
} from "../../../api/admin";
import { IconArrowLeft } from "../../../components/IconArrowLeft";
import ModalDeleteUser from "../../../components/ModalDeleteUser";

const UserSettings = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { data, isLoading } = useGetAdminUserResponse(userId);

  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] =
    useState<boolean>(false);
  useState<boolean>(false);
  const [isSuspended, setIsSuspended] = useState<boolean>(
    data?.is_suspended || true
  );

  const handleBackIconClick = (userId: string) => {
    navigate(`/admin/${userId}`);
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

  const handleSuspendUserSwitchClick = async (userId: number) => {
    if (isSuspended) {
      await getUnsuspendUserResponse(userId);
      setIsSuspended(false);
    } else {
      await getSuspendUserResponse(userId);
      setIsSuspended(true);
    }
  };

  if (isLoading) {
    return;
  }
  if (!data) {
    return;
  }

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
        height="100%"
        margin="24px"
        display="flex"
        flexDir="column"
        justifyContent="space-between"
        gap="24px"
      >
        <Box display="flex" flexDir="column" gap="12px">
          <Box display="flex" gap="8px">
            <IconButton
              onClick={() => handleBackIconClick(data.user_id)}
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
          <FormControl display="flex" alignItems="center">
            <FormLabel mb="0">Suspend user?</FormLabel>
            <Switch
              onChange={() => handleSuspendUserSwitchClick(data.user_id)}
              isChecked={isSuspended}
            />
          </FormControl>
        </Box>

        <Box>
          <Box display="flex" gap="16px" flexDirection="column">
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
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default UserSettings;
