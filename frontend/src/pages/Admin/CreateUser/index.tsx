import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Heading,
  IconButton,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { Button } from "@opengovsg/design-system-react";
import { debounce } from "es-toolkit";
import { useEffect, useState } from "react";
import { CreateUserRequest, getCreateUserResponse } from "../../../api/admin";
import { AppLanguage, Gender, Race } from "../../../api/user";
import FormFieldsUserCreateUpdate from "../../../components/FormFieldsUserCreateUpdate";
import { FormFieldsViewUser } from "../../../components/FormFieldsViewUser";

import { useNavigate } from "react-router-dom";
import { IconArrowLeft } from "../../../components/IconArrowLeft";
import ModalContentWithBannerSuccess from "../../../components/ModalContentWithBannerSuccess";
import {
  CREATE_USER_FORM_FIELDS_PROPS,
  VIEW_USER_FORM_FIELDS_PROPS,
} from "../constants";
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
  const navigate = useNavigate();

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
      navigate(`/admin`);
    } catch (error) {
      if (error?.response) {
        setErrorMessage("Something went wrong. Please try again later.");
      }
    }
    setIsCreateUserButtonLoading(false);
  }

  function handleBackIconClick() {
    navigate(`/admin`);
  }

  function handleHowDoesItWorkLinkClick() {
    navigate(`/admin/about`);
  }

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

          <Box display="flex" justifyContent="center"></Box>
        </Box>
        <Box display="flex" gap="16px" flexDirection="column">
          <Heading size="sm">Welcome to HeartBeat</Heading>
          <Text size="sm">
            Set up an account for your loved one to keep tabs on their mental
            well-being
          </Text>
          <Link onClick={handleHowDoesItWorkLinkClick}>How does it work?</Link>
        </Box>

        <Box display="flex" flexDirection="column" width="100%" gap="24px">
          <FormFieldsUserCreateUpdate
            createUserForm={createUserForm}
            setCreateUserForm={setCreateUserForm}
            createUpdateUserFormFields={CREATE_USER_FORM_FIELDS_PROPS}
          />
          <Alert status="error" variant="subtle" hidden={errorMessage === ""}>
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
            {hasCreatedUserSuccessfully ? "User created!" : "Create account"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default ModalCreateUser;
