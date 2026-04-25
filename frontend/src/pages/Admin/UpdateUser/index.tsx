import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useUpdateUser } from "../../../api/getUpdateUserResponse";
import { AppLanguage, CreateUserRequest, DashboardResponse } from "../../../api/types";
import FormFieldsUserCreateUpdate from "../../../components/FormFieldsUserCreateUpdate";
import { UPDATE_USER_FORM_FIELDS_PROPS } from "../constants";
import { getSubmitUpdateUserFormErrorMessage } from "../utils";

export interface UpdateUserForm extends CreateUserRequest {}

function dashboardDataToUpdateUserFormData(
  dashboardData: DashboardResponse
): UpdateUserForm {
  return {
    contactNumber: dashboardData.contact_number,
    name: dashboardData.name,
    age: dashboardData.age,
    alias: dashboardData.alias,
    race: dashboardData.race,
    gender: dashboardData.gender,
    appLanguage: AppLanguage.ENGLISH,
    postalCode: dashboardData.postal_code,
    floor: dashboardData.floor,
    unit: dashboardData.unit,
    block: dashboardData.block,
  };
}

function ModalUpdateUser(props: {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  dashboardData: DashboardResponse;
}) {
  const [updateUserForm, setUpdateUserForm] = useState<UpdateUserForm>(
    dashboardDataToUpdateUserFormData(props.dashboardData)
  );
  const [errorMessage, setErrorMessage] = useState("");
  const { mutate, isPending } = useUpdateUser();
  const queryClient = useQueryClient();
  const toast = useToast();

  useEffect(() => {
    setErrorMessage(getSubmitUpdateUserFormErrorMessage(updateUserForm));
  }, [updateUserForm]);

  function handleSubmit() {
    mutate(
      { userId: Number(props.userId), request: updateUserForm },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["getAdminUserResponse", Number(props.userId)],
          });
          props.onClose();
          toast({
            title: "User updated",
            description: "User details have been updated successfully",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        },
        onError: () => {
          toast({
            title: "Update failed",
            description: "Something went wrong. Please try again later.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        },
      }
    );
  }

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Personal Information</ModalHeader>
        <ModalCloseButton />
        <ModalBody display="flex" flexDirection="column" gap="16px">
          <FormFieldsUserCreateUpdate
            createUserForm={updateUserForm}
            setCreateUserForm={setUpdateUserForm}
            createUpdateUserFormFields={UPDATE_USER_FORM_FIELDS_PROPS}
          />
          {errorMessage && (
            <Alert status="error" variant="subtle" minH="52px">
              <AlertIcon flexShrink={0} />
              <AlertDescription sx={{ display: "block" }}>
                {errorMessage}
              </AlertDescription>
            </Alert>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={props.onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            isLoading={isPending}
            isDisabled={!!errorMessage}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default ModalUpdateUser;
