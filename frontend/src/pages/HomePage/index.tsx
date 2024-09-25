import { Box, Fade } from "@chakra-ui/react";
import moment from "moment";
import { useEffect, useState } from "react";
import { DEFAULT_USER_CREDENTIALS } from "../../api/constants";
import {
  DashboardResponse,
  getUserClaimGiftResponse,
  getUserDashboardResponse,
  getUserLoginResponse,
  getUserMoodResponse,
  MoodValue,
} from "../../api/user";
import Display from "./Display";
import MoodBtns from "./MoodBtns";

function HomePage() {
  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    const storedIndex = localStorage.getItem("currentIndex");
    return storedIndex !== null ? Number(storedIndex) : 0;
  });
  const [dashboardData, setDashboardData] = useState<DashboardResponse>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadDashboard = async () => {
      setIsLoading(true);
      if (DEFAULT_USER_CREDENTIALS.length > 0) {
        const loginResponse = await getUserLoginResponse(
          DEFAULT_USER_CREDENTIALS[currentIndex]
        );
        localStorage.setItem("token", loginResponse.access_token);
      }
      const dashboardResponse = await getUserDashboardResponse();
      setDashboardData(dashboardResponse);
      setIsLoading(false);
    };
    loadDashboard();
  }, [currentIndex]);

  const onMoodButtonClick = async (mood: MoodValue) => {
    const userMoodResponse = await getUserMoodResponse({ mood: mood });
    setDashboardData(userMoodResponse);
  };

  const onClaimGiftBtnClick = async () => {
    const userClaimGiftResponse = await getUserClaimGiftResponse();
    setDashboardData(userClaimGiftResponse);
  };

  const incrementIndex = () => {
    const nextIndex =
      currentIndex === DEFAULT_USER_CREDENTIALS.length - 1
        ? 0
        : currentIndex + 1;
    setCurrentIndex(nextIndex);
    localStorage.setItem("currentIndex", nextIndex.toString());
  };

  if (isLoading || !dashboardData) {
    return (
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        flexDirection="column"
        bg="brand.primary.400"
        className="page"
      ></Box>
    );
  }
  return (
    <Box
      width="100%"
      height="100%"
      display="flex"
      flexDirection="column"
      bg="brand.primary.400"
      className="page"
    >
      <Fade in={!isLoading} style={{ width: "100%", height: "100%" }}>
        <Box
          display="flex"
          flexDirection="column"
          bg="brand.secondary.400"
          paddingX="56px"
          paddingTop="68px"
          paddingBottom="32px"
          gap="60px"
          justifyContent="space-between"
          height="100%"
          className="page--group"
        >
          <Display
            dashboardData={dashboardData}
            goToNextUser={incrementIndex}
            onClaimGiftBtnClick={onClaimGiftBtnClick}
          ></Display>
          <MoodBtns
            isDisabled={!dashboardData.can_record_mood}
            moodsCreatedAt={dashboardData.moods.map((mood) =>
              moment(mood.created_at)
            )}
            streak={dashboardData.consecutive_checkins}
            onClick={onMoodButtonClick}
          ></MoodBtns>
        </Box>
      </Fade>
    </Box>
  );
}

export default HomePage;
