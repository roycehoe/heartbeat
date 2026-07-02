import { Box, Divider, Fade, Heading, Text, VStack, useToast } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import moment from "moment";
import { useState } from "react";
import { useGetCareReceipientDashboardResponse } from "@/api/getCareReceipientDashboardResponse";
import { useGetCareReceipientMoodResponse } from "@/api/getCareReceipientMoodResponse";
import { AppLanguage, SelectedMood } from "@/api/types";
import Display from "@/pages/HomePage/Display";
import MoodBtns from "@/pages/HomePage/MoodBtns";

const MOOD_RECORD_ERROR_TOAST: Record<
  AppLanguage,
  { title: string; description: string }
> = {
  [AppLanguage.ENGLISH]: {
    title: "Couldn't save your mood",
    description: "Please try again.",
  },
  [AppLanguage.CHINESE]: {
    title: "无法保存您的心情",
    description: "请再试一次。",
  },
  [AppLanguage.MALAY]: {
    title: "Gagal menyimpan mood anda",
    description: "Sila cuba lagi.",
  },
  [AppLanguage.TAMIL]: {
    title: "உங்கள் மனநிலையைச் சேமிக்க முடியவில்லை",
    description: "மீண்டும் முயற்சிக்கவும்.",
  },
};

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
  const queryClient = useQueryClient();
  const toast = useToast();

  const [moodMessage, setMoodMessage] = useState<string>("");
  const [hasMoodRecordError, setHasMoodRecordError] = useState<boolean>(false);

  const isSessionValid = !isNaN(careReceipientId) && careReceipientId > 0;

  const {
    data: dashboardData,
    isLoading,
    error,
  } = useGetCareReceipientDashboardResponse(careReceipientId);

  const { mutate: recordMood } = useGetCareReceipientMoodResponse(careReceipientId);

  const onMoodButtonClick = (mood: SelectedMood) => {
    recordMood({ mood }, {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: ["careReceipient", careReceipientId, "dashboard"],
        });
        setMoodMessage(data.mood_message);
      },
      onError: (error) => {
        const status = isAxiosError(error) ? error.response?.status : undefined;
        if (status === 401 || status === 403) {
          setHasMoodRecordError(true);
          return;
        }
        const appLanguage = dashboardData?.app_language ?? AppLanguage.ENGLISH;
        toast({
          ...MOOD_RECORD_ERROR_TOAST[appLanguage],
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      },
    });
  };

  if (!isSessionValid || error || hasMoodRecordError) {
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
            <Display />
          </Box>
          <Box height="50%">
            <MoodBtns
              isDisabled={!dashboardData.can_record_mood}
              moodsCreatedAt={dashboardData.moods.map((mood) =>
                moment(mood.created_at)
              )}
              streak={dashboardData.consecutive_checkins}
              appLanguage={dashboardData.app_language}
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
