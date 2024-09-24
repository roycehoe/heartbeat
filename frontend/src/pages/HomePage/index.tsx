import { Box } from "@chakra-ui/react";
import moment from "moment";
import { useEffect, useState } from "react";
import {
  DEFAULT_USER_CREDENTIALS,
  MOCK_DASHBOARD_API_RESPONSE,
} from "../../api/constants";
import { getUserLoginResponse, LoginRequest } from "../../api/user";
import Display from "./Display";
import MoodBtns from "./MoodBtns";

function HomePage() {
  const [currentIndex, setCurrentIndex] = useState(0);

  async function login(loginRequest: LoginRequest): Promise<void> {
    const loginResponse = await getUserLoginResponse(loginRequest);
    localStorage.removeItem("token");
    localStorage.setItem("token", loginResponse.access_token);
  }

  useEffect(() => {
    const storedIndex = localStorage.getItem("currentIndex");
    if (storedIndex !== null) {
      setCurrentIndex(Number(storedIndex));
    }
  }, []);

  useEffect(() => {
    if (DEFAULT_USER_CREDENTIALS.length > 0) {
      localStorage.setItem("currentIndex", currentIndex.toString());
      login(DEFAULT_USER_CREDENTIALS[currentIndex]);
    }
  }, [currentIndex, DEFAULT_USER_CREDENTIALS]);

  const incrementIndex = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === DEFAULT_USER_CREDENTIALS.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      bg="brand.primary.400"
      className="page"
    >
      <Box
        display="flex"
        flexDirection="column"
        bg="brand.secondary.400"
        marginX="56px"
        marginTop="68px"
        marginBottom="32px"
        gap="60px"
        justifyContent="space-between"
        height="100%"
        className="page--group"
      >
        <Display
          dashboardData={MOCK_DASHBOARD_API_RESPONSE}
          goToNextUser={incrementIndex}
        ></Display>
        <MoodBtns
          isDisabled={!MOCK_DASHBOARD_API_RESPONSE.can_record_mood}
          moodsCreatedAt={MOCK_DASHBOARD_API_RESPONSE.moods.map((mood) =>
            moment(mood.created_at)
          )}
          streak={MOCK_DASHBOARD_API_RESPONSE.consecutive_checkins}
        ></MoodBtns>
      </Box>
    </Box>
  );
}

export default HomePage;
