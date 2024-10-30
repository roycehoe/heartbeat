import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { Button } from "@opengovsg/design-system-react";
import { debounce } from "es-toolkit";
import { useEffect, useState } from "react";
import {
  CreateUserRequest,
  getCreateUserResponse,
  getUpdateUserResponse,
} from "../../../api/admin";
import { DashboardResponse } from "../../../api/user";
import FormFieldsUserCreateUpdate from "../../../components/FormFieldsUserCreateUpdate";
import ModalContentWithBannerSuccess from "../../../components/ModalContentWithBannerSuccess";
import { CREATE_UPDATE_USER_FORM_FIELDS_PROPS } from "../constants";
import { getSubmitCreateUpdateUserFormErrorMessage } from "../utils";

const MODAL_HEADER = "Update user";
const MODAL_BODY_BANNER = "User updated successfully!";

export interface UpdateUserForm extends CreateUserRequest {}

function dashboardDataToUpdateUserFormData(
  dashboardData: DashboardResponse
): UpdateUserForm {
  return {
    email: dashboardData.email,
    password: "",
    confirmPassword: "",
    contactNumber: dashboardData.contact_number,
    name: dashboardData.name,
    age: dashboardData.age,
    alias: dashboardData.alias,
    race: dashboardData.race,
    gender: dashboardData.gender,
    postalCode: dashboardData.postal_code,
    floor: dashboardData.floor,
  };
}

function ModalUpdateUser(props: {
  dashboardData: DashboardResponse;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [updateUserForm, setCreateUserForm] = useState({} as UpdateUserForm);
  const [errorMessage, setErrorMessage] = useState("");
  const [isCreateUserButtonLoading, setIsCreateUserButtonLoading] =
    useState(false);
  const [hasCreatedUserSuccessfully, setHasCreatedUserSuccessfully] =
    useState(false);

  useEffect(() => {
    setCreateUserForm(dashboardDataToUpdateUserFormData(props.dashboardData));
  }, []);

  useEffect(() => {
    setErrorMessage(getSubmitCreateUpdateUserFormErrorMessage(updateUserForm));
  }, [updateUserForm]);

  async function handleCreateUser() {
    setIsCreateUserButtonLoading(true);
    try {
      await getUpdateUserResponse(props.dashboardData.user_id, updateUserForm);
      setHasCreatedUserSuccessfully(true);
      setErrorMessage("");
      const closeModalWithDebounce = debounce(() => {
        props.onClose();
      }, 1000);
      closeModalWithDebounce();
    } catch (error) {
      if (error?.response) {
        setErrorMessage("Something went wrong. Please try again later.");
      }
    }
    setIsCreateUserButtonLoading(false);
  }

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent>
        {hasCreatedUserSuccessfully ? (
          <ModalContentWithBannerSuccess
            header={MODAL_HEADER}
            banner={MODAL_BODY_BANNER}
          ></ModalContentWithBannerSuccess>
        ) : (
          <>
            <ModalHeader>{MODAL_HEADER}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormFieldsUserCreateUpdate
                createUserForm={updateUserForm}
                setCreateUserForm={setCreateUserForm}
                createUpdateUserFormFields={
                  CREATE_UPDATE_USER_FORM_FIELDS_PROPS
                }
              ></FormFieldsUserCreateUpdate>
            </ModalBody>

            <ModalFooter>
              <Box
                display="flex"
                flexDirection="column"
                width="100%"
                gap="24px"
              >
                <Alert
                  status="error"
                  variant="subtle"
                  hidden={errorMessage === ""}
                >
                  <AlertIcon />
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
                <Button
                  mr="3px"
                  variant={hasCreatedUserSuccessfully ? "solid" : "outline"}
                  onClick={handleCreateUser}
                  isDisabled={errorMessage !== ""}
                  isLoading={isCreateUserButtonLoading}
                >
                  {hasCreatedUserSuccessfully ? "User updated!" : "Update"}
                </Button>
              </Box>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default ModalUpdateUser;
