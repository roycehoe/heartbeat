import { Box, Fade, Heading, Text, VStack } from "@chakra-ui/react";
import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DEFAULT_USER_CREDENTIALS } from "../../api/constants";
import { useGetCareReceipientClaimGiftResponse } from "../../api/getCareReceipientClaimGiftResponse";
import { useGetCareReceipientDashboardResponse } from "../../api/getCareReceipientDashboardResponse";
import { useGetCareReceipientMoodResponse } from "../../api/getCareReceipientMoodResponse";
import { SelectedMood } from "../../api/types";
import Display from "./Display";
import MoodBtns from "./MoodBtns";

function getCareReceipientIdFromToken(): number | null {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64));
    return typeof payload.care_receipient_id === "number"
      ? payload.care_receipient_id
      : null;
  } catch {
    return null;
  }
}

function HomePage() {
  const careReceipientId = getCareReceipientIdFromToken() ?? 0;

  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    const storedIndex = localStorage.getItem("currentIndex");
    return storedIndex !== null ? Number(storedIndex) : 0;
  });

  const [moodMessage, setMoodMessage] = useState<string>("");
  const navigate = useNavigate();

  const isSessionValid = !isNaN(careReceipientId) && careReceipientId > 0;

  const {
    data: dashboardData,
    isLoading,
    error,
  } = useGetCareReceipientDashboardResponse(careReceipientId);

  const { mutate: recordMood } = useGetCareReceipientMoodResponse(careReceipientId);
  const { mutate: claimGift } = useGetCareReceipientClaimGiftResponse();

  const onMoodButtonClick = (mood: SelectedMood) => {
    recordMood({ mood }, {
      onSuccess: (data) => setMoodMessage(data.mood_message),
      onError: () => navigate("/login"),
    });
  };

  const onClaimGiftBtnClick = () => {
    claimGift();
  };

  const incrementIndex = () => {
    const nextIndex =
      currentIndex === DEFAULT_USER_CREDENTIALS.length - 1
        ? 0
        : currentIndex + 1;
    setCurrentIndex(nextIndex);
    localStorage.setItem("currentIndex", nextIndex.toString());
  };

  if (!isSessionValid || error) {
    return (
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <VStack spacing={3} textAlign="center" px={6}>
          <Heading size="md">Your session has expired</Heading>
          <Text color="gray.600" fontSize="sm">
            Please ask your caregiver to send you a new login link.
          </Text>
        </VStack>
      </Box>
    );
  }
  if (isLoading || !dashboardData) {
    return (
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        flexDirection="column"
        className="page"
        bg="url('/assets/loading.svg')"
      />
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
          <Box height="50%">
            <Display
              dashboardData={dashboardData.data}
              goToNextUser={incrementIndex}
              onClaimGiftBtnClick={onClaimGiftBtnClick}
            />
          </Box>
          <Box height="50%">
            <MoodBtns
              isDisabled={!dashboardData.data.can_record_mood}
              moodsCreatedAt={dashboardData.data.moods.map((mood) =>
                moment(mood.created_at)
              )}
              streak={dashboardData.data.consecutive_checkins}
              onClick={onMoodButtonClick}
              moodMessage={moodMessage}
            />
          </Box>
        </Box>
      </Fade>
    </Box>
  );
}

export default HomePage;
