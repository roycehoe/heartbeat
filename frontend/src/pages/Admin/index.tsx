import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Fade,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { Button } from "@opengovsg/design-system-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DEFAULT_ADMIN_CREDENTIALS } from "../../api/constants";
import {
  DashboardResponse,
  getAdminDashboardResponse,
  getAdminLoginResponse,
  MoodValue,
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
  },
  password: {
    formLabel: "Password",
    isRequired: true,
    type: "password",
  },
  confirmPassword: {
    formLabel: "Confirm Password",
    isRequired: true,
    type: "password",
  },
  contactNumber: {
    formLabel: "Contact Number",
    isRequired: true,
    type: "tel",
  },
  name: {
    formLabel: "Name",
    isRequired: true,
    type: "text",
  },
  alias: {
    formLabel: "Alias",
    isRequired: false,
    type: "text",
  },
  race: {
    formLabel: "Race",
    isRequired: false,
    type: "text",
  },
  gender: {
    formLabel: "Gender",
    isRequired: false,
    type: "text",
  },
  postalCode: {
    formLabel: "Postal Code",
    isRequired: true,
    type: "text",
  },
  floor: {
    formLabel: "Floor",
    isRequired: false,
    type: "text",
  },
};
// function FormCreateUser() {
//   const [formValues, setFormValues] = useState({
//     email: "",
//     password: "",
//     confirmPassword: "",
//     contactNumber: "",
//     name: "",
//     alias: "",
//     race: "",
//     gender: "",
//     postalCode: "",
//     floor: "",
//   });

//   const handleChange = (e, field) => {
//     setFormValues({
//       ...formValues,
//       [field]: e.target.value,
//     });
//   };

//   return (
//     <>
//       {Object.keys(CREATE_USER_FORM_FIELDS).map((field) => {
//         const { formLabel, isRequired, type } = CREATE_USER_FORM_FIELDS[field];

//         return (
//           <FormControl key={field} isRequired={isRequired} mb="16px">
//             <FormLabel>{formLabel}</FormLabel>
//             <Input
//               type={type}
//               value={formValues[field]}
//               onChange={(e) => handleChange(e, field)}
//               placeholder={formLabel}
//               size="xs"
//               borderColor="slate.300"
//               _placeholder={{ color: "gray.500" }}
//             />
//           </FormControl>
//         );
//       })}
//     </>
//   );
// }

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
    <FormControl key={props.field} isRequired={props.isRequired} mb="16px">
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

function FormCreateUser() {
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    contactNumber: "",
    name: "",
    alias: "",
    race: "",
    gender: "",
    postalCode: "",
    floor: "",
  });

  const handleChange = (e, field) => {
    setFormValues({
      ...formValues,
      [field]: e.target.value,
    });
  };

  return (
    <>
      {Object.keys(CREATE_USER_FORM_FIELDS).map((field) => {
        const { formLabel, isRequired, type } = CREATE_USER_FORM_FIELDS[field];

        return (
          <FormInput
            field={field}
            isRequired={isRequired}
            formLabel={formLabel}
            type={type}
            value={formValues[field]}
            onChange={(e) => handleChange(e, field)}
            placeholder={formLabel}
          ></FormInput>
        );
      })}
    </>
  );
}

function ModalCreateUser(props: { isOpen: boolean; onClose: () => void }) {
  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create user</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormCreateUser></FormCreateUser>
        </ModalBody>

        <ModalFooter>
          <Button mr="3px" variant="outline" onClick={props.onClose}>
            Create
          </Button>
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
