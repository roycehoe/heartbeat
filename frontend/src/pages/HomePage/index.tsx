import { Box, Divider, Fade, Heading, Text, VStack } from "@chakra-ui/react";
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
        <VStack
          spacing={4}
          textAlign="center"
          px={6}
          divider={<Divider borderColor="gray.200" />}
        >
          <VStack spacing={1}>
            <Heading size="sm">Sign in again</Heading>
            <Text color="gray.600" fontSize="sm">
              To continue, open the link your caregiver sent you.
            </Text>
          </VStack>
          <VStack spacing={1}>
            <Heading size="sm">请重新登录</Heading>
            <Text color="gray.600" fontSize="sm">
              请开启看护人发给您的链接，即可继续使用。
            </Text>
          </VStack>
          <VStack spacing={1}>
            <Heading size="sm">Log masuk semula</Heading>
            <Text color="gray.600" fontSize="sm">
              Untuk meneruskan, buka pautan yang dihantar pengasuh anda.
            </Text>
          </VStack>
          <VStack spacing={1}>
            <Heading size="sm">மீண்டும் உள்நுழையவும்</Heading>
            <Text color="gray.600" fontSize="sm">
              தொடர்வதற்கு, உங்கள் பராமரிப்பாளர் அனுப்பிய இணைப்பைத் திறக்கவும்.
            </Text>
          </VStack>
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
              appLanguage={dashboardData.data.app_language}
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
