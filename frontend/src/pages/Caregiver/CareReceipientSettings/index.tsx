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
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetCareReceipientDetailResponse } from "../../../api/getCareReceipientDetailResponse";
import { useGetCareReceipientDeleteResponse } from "../../../api/getCareReceipientDeleteResponse";
import { useGetCareReceipientSuspendResponse } from "../../../api/getCareReceipientSuspendResponse";
import { useGetCareReceipientUnsuspendResponse } from "../../../api/getCareReceipientUnsuspendResponse";
import { IconArrowLeft } from "../../../components/IconArrowLeft";
import ModalDeleteCareReceipient from "../../../components/ModalDeleteCareReceipient";

const CareReceipientSettings = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();
  const { data, isLoading } = useGetCareReceipientDetailResponse(Number(userId));

  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] =
    useState<boolean>(false);

  const { mutate: suspendUser } = useGetCareReceipientSuspendResponse();
  const { mutate: unsuspendUser } = useGetCareReceipientUnsuspendResponse();
  const { mutate: deleteUser } = useGetCareReceipientDeleteResponse();

  const handleBackIconClick = (userId: string) => {
    navigate(`/admin/${userId}`);
  };

  const handleOnConfirmModalDeleteCareReceipient = (userId: number) => {
    deleteUser(userId, {
      onSuccess: () => {
        setIsDeleteUserModalOpen(false);
        toast({
          title: "User Deleted Successfully",
          description: "This user's account has been deleted successfully",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        navigate(`/admin`);
      },
    });
  };

  const handleSuspendUserSwitchClick = (userId: number) => {
    const mutate = data?.is_suspended ? unsuspendUser : suspendUser;
    mutate(userId, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["getCareReceipientDetailResponse", userId],
        });
      },
    });
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
              isChecked={data.is_suspended}
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
            <ModalDeleteCareReceipient
              isOpen={isDeleteUserModalOpen}
              onClose={() => setIsDeleteUserModalOpen(false)}
              onConfirm={() => handleOnConfirmModalDeleteCareReceipient(Number(userId))}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CareReceipientSettings;
