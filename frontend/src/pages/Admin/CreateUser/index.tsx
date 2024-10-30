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
import { Banner, Button } from "@opengovsg/design-system-react";
import { debounce } from "es-toolkit";
import { useEffect, useState } from "react";
import { CreateUserRequest, getCreateUserResponse } from "../../../api/admin";
import { Gender, Race } from "../../../api/user";
import FormInputUser from "../../../components/FormInputUser";
import FormInputUserPassword from "../../../components/FormInputUserPassword";
import FormSelectUser from "../../../components/FormSelectUser";
import {
  CREATE_UPDATE_USER_FORM_FIELDS_PROPS,
  CreateUpdateUserFormFieldProps,
} from "../constants";
import { getSubmitCreateUpdateUserFormErrorMessage } from "../utils";

const MODAL_HEADER = "Create user";
const MODAL_BODY_BANNER = "User created successfully!";

export interface CreateUserForm extends CreateUserRequest {}

const DEFAULT_CREATE_USER_FORM: CreateUserForm = {
  email: "",
  password: "",
  confirmPassword: "",
  contactNumber: "",
  name: "",
  age: "",
  alias: "",
  race: Race.CHINESE,
  gender: Gender.MALE,
  postalCode: "",
  floor: "",
};

function FormUserCreateUpdate(props: {
  createUpdateUserFormFields: Record<
    keyof CreateUserForm,
    CreateUpdateUserFormFieldProps
  >;
  createUserForm: CreateUserForm;
  setCreateUserForm: React.Dispatch<React.SetStateAction<CreateUserForm>>;
}) {
  const handleChange = (e, field) => {
    props.setCreateUserForm({
      ...props.createUserForm,
      [field]: e.target.value,
    });
  };

  return (
    <Box display="flex" flexDirection="column" gap="16px">
      {Object.keys(props.createUpdateUserFormFields).map((field) => {
        const { formLabel, isRequired, type, options } =
          props.createUpdateUserFormFields[field];

        if (type === "select") {
          return (
            <FormSelectUser
              field={field}
              isRequired={isRequired}
              formLabel={formLabel}
              type={type}
              value={props.createUserForm[field]}
              onChange={(e) => handleChange(e, field)}
              placeholder={formLabel}
              options={options}
            ></FormSelectUser>
          );
        }
        if (type === "password") {
          return (
            <FormInputUserPassword
              field={field}
              isRequired={isRequired}
              formLabel={formLabel}
              type={type}
              value={props.createUserForm[field]}
              onChange={(e) => handleChange(e, field)}
              placeholder={formLabel}
            ></FormInputUserPassword>
          );
        }

        return (
          <FormInputUser
            field={field}
            isRequired={isRequired}
            formLabel={formLabel}
            type={type}
            value={props.createUserForm[field]}
            onChange={(e) => handleChange(e, field)}
            placeholder={formLabel}
          ></FormInputUser>
        );
      })}
    </Box>
  );
}

function ModalContentWithBannerSuccess(props: {
  header: string;
  banner: string;
}) {
  return (
    <ModalContent>
      <ModalHeader>{props.header}</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Banner>{props.banner}</Banner>
      </ModalBody>
      <ModalFooter></ModalFooter>
    </ModalContent>
  );
}

function ModalCreateUser(props: { isOpen: boolean; onClose: () => void }) {
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
    setErrorMessage(getSubmitCreateUpdateUserFormErrorMessage(createUserForm));
  }, [createUserForm]);

  async function handleCreateUser() {
    setIsCreateUserButtonLoading(true);
    try {
      await getCreateUserResponse(createUserForm);
      resetCreateUserForm();
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
            <ModalHeader>Create user</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormUserCreateUpdate
                createUserForm={createUserForm}
                setCreateUserForm={setCreateUserForm}
                createUpdateUserFormFields={
                  CREATE_UPDATE_USER_FORM_FIELDS_PROPS
                }
              ></FormUserCreateUpdate>
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
