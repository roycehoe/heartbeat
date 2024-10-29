import { Box, Fade } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DEFAULT_ADMIN_CREDENTIALS } from "../../api/constants";
import {
  DashboardResponse,
  getAdminDashboardResponse,
  getAdminLoginResponse,
} from "../../api/user";
import Brand from "../../components/Brand";

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
              <Box background="green.100">First button</Box>
              <Box background="green.100">Second button</Box>
            </Box>
            <Box background="yellow.100" height="100%">
              <Box>This is a row</Box>
              <Box>This is a row</Box>
              <Box>This is a row</Box>
              <Box>This is a row</Box>
              <Box>This is a row</Box>
              <Box>This is a row</Box>
            </Box>
          </Box>
        </Box>
      </Fade>
    </Box>
  );
}

export default Admin;
