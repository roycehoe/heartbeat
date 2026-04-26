import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Heading,
  IconButton,
  Link,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Button } from "@opengovsg/design-system-react";
import { useEffect, useState } from "react";
import { useGetCareReceipientCreateResponse } from "../../../api/getCareReceipientCreateResponse";
import { AppLanguage, CareReceipientCreateRequest, Gender, Race } from "../../../api/types";
import FormFieldsCareReceipientCreateUpdate from "../../../components/FormFieldsCareReceipientCreateUpdate";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { IconArrowLeft } from "../../../components/IconArrowLeft";
import { CREATE_CARE_RECEIPIENT_FORM_FIELDS_PROPS } from "../constants";
import { getSubmitCreateCareReceipientFormErrorMessage } from "../utils";

export interface CreateCareReceipientForm extends CareReceipientCreateRequest {
  hasAgreedToTermsAndConditions: boolean;
}

const DEFAULT_CREATE_CARE_RECEIPIENT_FORM: CreateCareReceipientForm = {
  contactNumber: "",
  name: "",
  age: "",
  alias: "",
  race: Race.CHINESE,
  gender: Gender.MALE,
  appLanguage: AppLanguage.ENGLISH,
  postalCode: "",
  floor: "",
  block: "",
  unit: "",
  hasAgreedToTermsAndConditions: false,
};

function ModalCreateCareReceipient() {
  const [createCareReceipientForm, setCreateCareReceipientForm] = useState({
    ...DEFAULT_CREATE_CARE_RECEIPIENT_FORM,
  } as CreateCareReceipientForm);
  const [errorMessage, setErrorMessage] = useState("");
  const [hasCreatedUserSuccessfully, setHasCreatedUserSuccessfully] =
    useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const { mutate, isPending } = useGetCareReceipientCreateResponse();

  function resetCreateCareReceipientForm() {
    setCreateCareReceipientForm({ ...DEFAULT_CREATE_CARE_RECEIPIENT_FORM });
  }

  useEffect(() => {
    setErrorMessage(getSubmitCreateCareReceipientFormErrorMessage(createCareReceipientForm));
  }, [createCareReceipientForm]);

  async function handleCreateCareReceipient() {
    mutate(
      {
        ...createCareReceipientForm,
      },
      {
        onSuccess: () => {
          resetCreateCareReceipientForm();
          setHasCreatedUserSuccessfully(true);
          setErrorMessage("");
          navigate(`/dashboard`);
          toast({
            title: "User created",
            description: "Your user has been created successfully",
            status: "success",
            duration: 9000,
            isClosable: true,
          });
        },
        onError: (error) => {
          setErrorMessage("Something went wrong. Please try again later.");
        },
      }
    );
    // try {
    //   await getCreateUserResponse(createUserForm);
    //   resetCreateUserForm();
    //   setHasCreatedUserSuccessfully(true);
    //   setErrorMessage("");
    //   navigate(`/admin`);
    // } catch (error) {
    //   if (error?.response) {
    //     setErrorMessage("Something went wrong. Please try again later.");
    //   }
    // }
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
            onClick={() => navigate(`/dashboard`)}
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
          <Link onClick={() => navigate(`/dashboard/about`)}>
            How does it work?
          </Link>
        </Box>

        <Box display="flex" flexDirection="column" width="100%" gap="24px">
          <FormFieldsCareReceipientCreateUpdate
            createCareReceipientForm={createCareReceipientForm}
            setCreateCareReceipientForm={setCreateCareReceipientForm}
            createUpdateCareReceipientFormFields={CREATE_CARE_RECEIPIENT_FORM_FIELDS_PROPS}
          />
          <Alert status="error" variant="subtle" hidden={errorMessage === ""}>
            <AlertIcon />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
          <Button
            mr="3px"
            variant={hasCreatedUserSuccessfully ? "solid" : "outline"}
            onClick={handleCreateCareReceipient}
            isLoading={isPending}
          >
            {hasCreatedUserSuccessfully ? "User created!" : "Create account"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default ModalCreateCareReceipient;
