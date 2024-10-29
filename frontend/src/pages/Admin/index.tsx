import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Fade,
  Text,
} from "@chakra-ui/react";
import { Button } from "@opengovsg/design-system-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DEFAULT_ADMIN_CREDENTIALS } from "../../api/constants";
import {
  DashboardResponse,
  getAdminDashboardResponse,
  getAdminLoginResponse,
} from "../../api/user";

function Admin() {
  const [dashboardData, setDashboardData] = useState<DashboardResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
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
          background="brand.secondary.300"
        >
          <Box
            height="100%"
            margin="36px"
            display="flex"
            flexDirection="column"
            gap="8px"
            background="brand.primary.100"
          >
            <Box
              background="red.300"
              display="flex"
              width="100%"
              justifyContent="flex-end"
              gap="8px"
            >
              <Button variant="solid">Create user</Button>
            </Box>
            <Box background="yellow.100" height="100%">
              <Accordion allowMultiple>
                <AccordionItem>
                  <Box>
                    <AccordionButton
                      display="flex"
                      justifyContent="space-between"
                    >
                      <Box display="flex" gap="8px">
                        <Text>🟩</Text>
                        <Text>Lee Something</Text>
                      </Box>
                      <AccordionIcon></AccordionIcon>
                    </AccordionButton>
                  </Box>
                  <AccordionPanel
                    pb="4"
                    display="flex"
                    flexDirection="column"
                    gap="12px"
                  >
                    <Box className="accordion-details-text">
                      <Text>Name: Some very long name goes here</Text>
                      <Text>Age: 69</Text>
                      <Text>Race: Chinese</Text>
                      <Text>Contact no: 91234123</Text>
                      <Text>Address: Blk 123</Text>
                      <Text>Mood: 🟩🟩🟩🟩🟩 </Text>
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
              </Accordion>
            </Box>
          </Box>
        </Box>
      </Fade>
    </Box>
  );
}

export default Admin;
