import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Fade,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { Button } from "@opengovsg/design-system-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreateUserRequest, getCreateUserResponse } from "../../api/admin";
import { DEFAULT_ADMIN_CREDENTIALS } from "../../api/constants";
import {
  DashboardResponse,
  Gender,
  getAdminDashboardResponse,
  getAdminLoginResponse,
  MoodValue,
  Race,
} from "../../api/user";

const MOOD_VALUE_TO_EMOJI = {
  [MoodValue.HAPPY]: "🟩",
  [MoodValue.OK]: "🟨",
  [MoodValue.SAD]: "🟥",
};
const MAX_MOOD_DISPLAY = 7;
const CREATE_USER_FORM_FIELDS = {
  email: {
    formLabel: "Email",
    isRequired: true,
    type: "email",
    options: [],
  },
  password: {
    formLabel: "Password",
    isRequired: true,
    type: "password",
    options: [],
  },
  confirmPassword: {
    formLabel: "Confirm Password",
    isRequired: true,
    type: "password",
    options: [],
  },
  contactNumber: {
    formLabel: "Contact Number",
    isRequired: true,
    type: "tel",
    options: [],
  },
  name: {
    formLabel: "Name",
    isRequired: true,
    type: "text",
    options: [],
  },
  alias: {
    formLabel: "Alias",
    isRequired: true,
    type: "text",
    options: [],
  },
  race: {
    formLabel: "Race",
    isRequired: true,
    type: "select",
    options: [Race.CHINESE, Race.INDIAN, Race.MALAY, Race.OTHERS],
  },
  gender: {
    formLabel: "Gender",
    isRequired: true,
    type: "select",
    options: [Gender.MALE, Gender.FEMALE],
  },
  postalCode: {
    formLabel: "Postal Code",
    isRequired: true,
    type: "text",
    options: [],
  },
  floor: {
    formLabel: "Floor",
    isRequired: true,
    type: "text",
    options: [],
  },
};

interface CreateUserForm extends CreateUserRequest {}

const DEFAULT_CREATE_USER_FORM: CreateUserForm = {
  email: "",
  password: "",
  confirmPassword: "",
  contactNumber: "",
  name: "",
  alias: "",
  race: Race.CHINESE,
  gender: Gender.MALE,
  postalCode: "",
  floor: "",
};

function FormSelect(props: {
  field: string;
  isRequired: boolean;
  formLabel: string;
  type: string;
  value: string;
  onChange: (e: any, field: any) => void;
  placeholder: string;
  options: string[];
}) {
  return (
    <FormControl key={props.field} isRequired={props.isRequired}>
      <FormLabel>{props.formLabel}</FormLabel>
      <Select variant="outline">
        {props.options.map((option) => {
          return <option value={option}>{option}</option>;
        })}
      </Select>
    </FormControl>
  );
}

function FormInputPassword(props: {
  field: string;
  isRequired: boolean;
  formLabel: string;
  type: string;
  value: string;
  onChange: (e: any, field: any) => void;
  placeholder: string;
}) {
  const [isShow, setIsShow] = useState(false);
  const handleClick = () => setIsShow(!isShow);

  return (
    <FormControl key={props.field} isRequired={props.isRequired}>
      <FormLabel>{props.formLabel}</FormLabel>
      <InputGroup>
        <Input
          type={isShow ? "text" : "password"}
          value={props.value}
          onChange={props.onChange}
          placeholder={props.placeholder}
          borderColor="slate.300"
          _placeholder={{ color: "gray.500" }}
        />
        <InputRightElement>
          <Button
            size="xs"
            marginRight="18px"
            padding="8px"
            variant="outline"
            onClick={handleClick}
          >
            {isShow ? "Hide" : "Show"}
          </Button>
        </InputRightElement>
      </InputGroup>
    </FormControl>
  );
}

function FormInput(props: {
  field: string;
  isRequired: boolean;
  formLabel: string;
  type: string;
  value: string;
  onChange: (e: any, field: any) => void;
  placeholder: string;
}) {
  return (
    <FormControl key={props.field} isRequired={props.isRequired}>
      <FormLabel>{props.formLabel}</FormLabel>
      <Input
        type={props.type}
        value={props.value}
        onChange={props.onChange}
        placeholder={props.placeholder}
        size="xs"
        borderColor="slate.300"
        _placeholder={{ color: "gray.500" }}
      />
    </FormControl>
  );
}

function getSubmitCreateUserFormErrorMessage(
  createUserForm: CreateUserForm
): string {
  if (!createUserForm.email) {
    return "Email is required.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(createUserForm.email)) {
    return "Invalid email format.";
  }

  if (!createUserForm.password) {
    return "Password is required.";
  }
  if (createUserForm.password.length < 8) {
    return "Password must be at least 8 characters long.";
  }

  if (!createUserForm.confirmPassword) {
    return "Please confirm your password.";
  }
  if (createUserForm.password !== createUserForm.confirmPassword) {
    return "Passwords do not match.";
  }

  if (!createUserForm.contactNumber) {
    return "Contact number is required.";
  }
  if (!/^\d+$/.test(createUserForm.contactNumber)) {
    return "Contact number must contain only digits.";
  }
  if (createUserForm.contactNumber.length !== 8) {
    return "Contact number must contain exactly eight digits.";
  }

  if (!createUserForm.name) {
    return "Name is required.";
  }

  if (!createUserForm.alias) {
    return "Alias is required.";
  }
  if (createUserForm.alias.length > 12) {
    return "Alias must be less than 12 characters.";
  }

  if (!createUserForm.postalCode) {
    return "Postal code is required.";
  } else if (!/^\d{6}$/.test(createUserForm.postalCode)) {
    return "Postal code must be 6 digits.";
  }

  if (!createUserForm.floor) {
    return "Floor is required.";
  }

  return "";
}

function FormCreateUser(props: {
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
      {Object.keys(CREATE_USER_FORM_FIELDS).map((field) => {
        const { formLabel, isRequired, type, options } =
          CREATE_USER_FORM_FIELDS[field];

        if (type === "select") {
          return (
            <FormSelect
              field={field}
              isRequired={isRequired}
              formLabel={formLabel}
              type={type}
              value={props.createUserForm[field]}
              onChange={(e) => handleChange(e, field)}
              placeholder={formLabel}
              options={options}
            ></FormSelect>
          );
        }
        if (type === "password") {
          return (
            <FormInputPassword
              field={field}
              isRequired={isRequired}
              formLabel={formLabel}
              type={type}
              value={props.createUserForm[field]}
              onChange={(e) => handleChange(e, field)}
              placeholder={formLabel}
            ></FormInputPassword>
          );
        }

        return (
          <FormInput
            field={field}
            isRequired={isRequired}
            formLabel={formLabel}
            type={type}
            value={props.createUserForm[field]}
            onChange={(e) => handleChange(e, field)}
            placeholder={formLabel}
          ></FormInput>
        );
      })}
    </Box>
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

  useEffect(() => {
    setErrorMessage(getSubmitCreateUserFormErrorMessage(createUserForm));
  }, [createUserForm]);

  async function handleCreateUser() {
    setIsCreateUserButtonLoading(true);
    try {
      await getCreateUserResponse(createUserForm);
      setHasCreatedUserSuccessfully(true);
    } catch (error) {
      setErrorMessage(error?.response);
    }
    setIsCreateUserButtonLoading(false);
  }

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create user</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormCreateUser
            createUserForm={createUserForm}
            setCreateUserForm={setCreateUserForm}
          ></FormCreateUser>
        </ModalBody>

        <ModalFooter>
          <Box display="flex" flexDirection="column" width="100%" gap="24px">
            <Alert status="error" variant="subtle" hidden={errorMessage === ""}>
              <AlertIcon />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
            <Button
              mr="3px"
              variant={hasCreatedUserSuccessfully ? "solid" : "outline"}
              onClick={props.onClose}
              isDisabled={errorMessage !== ""}
              isLoading={isCreateUserButtonLoading}
            >
              {hasCreatedUserSuccessfully ? "User created!" : "Create"}
            </Button>
          </Box>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function AccordionItemDashboard(props: { dashboardData: DashboardResponse }) {
  return (
    <AccordionItem>
      <Box>
        <AccordionButton display="flex" justifyContent="space-between">
          <Box display="flex" gap="8px">
            <Text>{props.dashboardData.can_record_mood ? "⌛" : "🟩"}</Text>
            <Text>{props.dashboardData.alias}</Text>
          </Box>
          <AccordionIcon></AccordionIcon>
        </AccordionButton>
      </Box>
      <AccordionPanel pb="4" display="flex" flexDirection="column" gap="12px">
        <Box className="accordion-details-text">
          <Text>Name: {props.dashboardData.name}</Text>
          <Text>Age: {props.dashboardData.age}</Text>
          <Text>Race: {props.dashboardData.race}</Text>
          <Text>Contact no: {props.dashboardData.contact_number}</Text>
          <Text>Postal code: {props.dashboardData.postal_code}</Text>
          <Text>
            Mood:{" "}
            {props.dashboardData.moods
              .map((mood) => MOOD_VALUE_TO_EMOJI[mood.mood])
              .slice(0)
              .slice(-MAX_MOOD_DISPLAY)}
          </Text>
        </Box>
        <Box
          className="accordion-details-buttons"
          display="flex"
          justifyContent="flex-end"
          gap="8px"
        >
          <Button colorScheme="success" variant="solid">
            Update
          </Button>
          <Button colorScheme="critical" variant="solid">
            Delete
          </Button>
        </Box>
      </AccordionPanel>
    </AccordionItem>
  );
}

function Admin() {
  const [dashboardData, setDashboardData] = useState<DashboardResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }

    const loadDashboard = async () => {
      setIsLoading(true);
      const loginResponse = await getAdminLoginResponse(
        DEFAULT_ADMIN_CREDENTIALS
      );
      localStorage.setItem("token", loginResponse.access_token);
      const dashboardResponse = await getAdminDashboardResponse();
      setDashboardData(dashboardResponse);
      setIsLoading(false);
    };
    loadDashboard();
  }, []);

  if (isLoading || !dashboardData) {
    return (
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        flexDirection="column"
        className="page"
        bg="url('/assets/loading.svg')"
      ></Box>
    );
  }
  return (
    <Box
      width="100%"
      height="100%"
      display="flex"
      flexDirection="column"
      className="page"
    >
      <Fade in={!isLoading} style={{ width: "100%", height: "100%" }}>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          height="100%"
          className="page--group"
        >
          <Box
            height="100%"
            margin="36px"
            display="flex"
            flexDirection="column"
            gap="8px"
          >
            <Box
              display="flex"
              width="100%"
              justifyContent="flex-end"
              gap="8px"
            >
              <Button variant="outline" onClick={onOpen}>
                Create user
              </Button>
              <ModalCreateUser
                isOpen={isOpen}
                onClose={onClose}
              ></ModalCreateUser>
            </Box>
            <Box height="100%" borderWidth="1px" borderRadius="lg">
              <Accordion allowMultiple>
                {dashboardData.map((data) => {
                  return (
                    <AccordionItemDashboard
                      dashboardData={data}
                    ></AccordionItemDashboard>
                  );
                })}
              </Accordion>
            </Box>
          </Box>
        </Box>
      </Fade>
    </Box>
  );
}

export default Admin;
