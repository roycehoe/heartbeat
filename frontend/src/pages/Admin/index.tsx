import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Fade,
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
import ModalCreateUser from "./CreateUser";
import ModalUpdateUser from "./UpdateUser";

const MOOD_VALUE_TO_EMOJI = {
  [MoodValue.HAPPY]: "🟩",
  [MoodValue.OK]: "🟨",
  [MoodValue.SAD]: "🟥",
};
const MAX_MOOD_DISPLAY = 7;

function AccordionItemDashboard(props: {
  dashboardData: DashboardResponse;
  reloadDashboardData: () => Promise<void>;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
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
          <Button colorScheme="success" variant="solid" onClick={onOpen}>
            Update
          </Button>
          <ModalUpdateUser
            dashboardData={props.dashboardData}
            isOpen={isOpen}
            onClose={onClose}
            reloadDashboardData={props.reloadDashboardData}
          ></ModalUpdateUser>
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

  const loadDashboardData = async () => {
    setIsLoading(true);
    const dashboardResponse = await getAdminDashboardResponse();
    setDashboardData(dashboardResponse);
    setIsLoading(false);
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }
    loadDashboardData();
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
                reloadDashboardData={loadDashboardData}
              ></ModalCreateUser>
            </Box>
            <Box height="100%" borderWidth="1px" borderRadius="lg">
              <Accordion allowMultiple>
                {dashboardData.map((data) => {
                  return (
                    <AccordionItemDashboard
                      dashboardData={data}
                      reloadDashboardData={loadDashboardData}
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
