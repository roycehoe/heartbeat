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
import { CreateUserRequest, getCreateUserResponse } from "../../../api/admin";
import { AppLanguage, Gender, Race } from "../../../api/user";
import FormFieldsUserCreateUpdate from "../../../components/FormFieldsUserCreateUpdate";
import ModalContentWithBannerSuccess from "../../../components/ModalContentWithBannerSuccess";
import { CREATE_USER_FORM_FIELDS_PROPS } from "../constants";
import { getSubmitCreateUserFormErrorMessage } from "../utils";

const MODAL_HEADER = "Create user";
const MODAL_BODY_BANNER = "User created successfully!";

export interface CreateUserForm extends CreateUserRequest {
  hasAgreedToTermsAndConditions: boolean;
}

const DEFAULT_CREATE_USER_FORM: CreateUserForm = {
  username: "",
  password: "",
  confirmPassword: "",
  contactNumber: "",
  name: "",
  age: "",
  alias: "",
  race: Race.CHINESE,
  gender: Gender.MALE,
  appLanguage: AppLanguage.ENGLISH,
  postalCode: "",
  floor: "",
  hasAgreedToTermsAndConditions: false,
};

function ModalCreateUser() {
  const [createUserForm, setCreateUserForm] = useState({
    ...DEFAULT_CREATE_USER_FORM,
  } as CreateUserForm);
  const [errorMessage, setErrorMessage] = useState("");
  const [isCreateUserButtonLoading, setIsCreateUserButtonLoading] =
    useState(false);
  const [hasCreatedUserSuccessfully, setHasCreatedUserSuccessfully] =
    useState(false);

  function resetCreateUserForm() {
    setCreateUserForm({ ...DEFAULT_CREATE_USER_FORM });
  }

  useEffect(() => {
    setErrorMessage(getSubmitCreateUserFormErrorMessage(createUserForm));
  }, [createUserForm]);

  async function handleCreateUser() {
    setIsCreateUserButtonLoading(true);
    try {
      await getCreateUserResponse(createUserForm);
      resetCreateUserForm();
      setHasCreatedUserSuccessfully(true);
      setErrorMessage("");
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
            <ModalHeader>Create user</ModalHeader>
            <ModalCloseButton />
            <ModalBody></ModalBody>

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
                  {hasCreatedUserSuccessfully ? "User created!" : "Create"}
                </Button>
              </Box>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default ModalCreateUser;
