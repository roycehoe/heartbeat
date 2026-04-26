import {
  Box,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { AppLanguage } from "@/api/types";

const STREAK_LABEL: Record<AppLanguage, { pre: string; post: string }> = {
  [AppLanguage.ENGLISH]: { pre: "", post: " day streak!" },
  [AppLanguage.CHINESE]: { pre: "连续打卡 ", post: " 天!" },
  [AppLanguage.MALAY]: { pre: "", post: " hari berturut-turut!" },
  [AppLanguage.TAMIL]: { pre: "", post: " நாள் தொடர்ச்சி!" },
};

const STREAK_FOOTER: Record<AppLanguage, string> = {
  [AppLanguage.ENGLISH]: "Keep your streak going by checking in tomorrow!",
  [AppLanguage.CHINESE]: "记得明天打卡，继续保持连续哦",
  [AppLanguage.MALAY]: "Teruskan rentak anda dengan mendaftar masuk esok!",
  [AppLanguage.TAMIL]: "நாளை செக் இன் செய்வதன் மூலம் உங்கள் தொடர்ச்சியை தொடர்ந்து வையுங்கள்!",
};

function StreakCountDisplay(props: {
  streakCount: number;
  appLanguage: AppLanguage;
}) {
  const { pre, post } = STREAK_LABEL[props.appLanguage] ?? STREAK_LABEL[AppLanguage.ENGLISH];
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-evenly"
      alignItems="center"
    >
      <Text fontWeight="600" fontSize="86px" color="#25AC51" lineHeight="1">
        {props.streakCount}
      </Text>
      <Text fontWeight="600" fontSize="32px" color="#25AC51">
        {pre}{props.streakCount}{post}
      </Text>
    </Box>
  );
}

function ModalMoodStreak({
  isOpen,
  handleClose,
  daysOfWeek,
  tickData,
  streak,
  appLanguage,
}: {
  isOpen: boolean;
  handleClose: () => void;
  daysOfWeek: string[];
  tickData: boolean[];
  streak: number;
  appLanguage: AppLanguage;
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="full"
      isCentered
      motionPreset="slideInBottom"
    >
      <ModalOverlay />
      <ModalContent margin="0" rounded="none">
        <ModalBody
          display="flex"
          flexDirection="column"
          justifyContent="space-evenly"
          alignItems="center"
          margin="30px"
        >
          <Box style={{ position: "relative" }}>
            <img
              style={{
                maxHeight: "250px",
                width: "100%",
              }}
              src="/assets/celebration-banner/seedling.gif"
            />
            <Box
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                height: "100%",
                width: "1%", // Hack to cover black bar for gif
                backgroundColor: "white",
              }}
            />
          </Box>
          <StreakCountDisplay streakCount={streak} appLanguage={appLanguage} />

          <Box>
            <Box
              className="streak__table"
              borderRadius="12px"
              border="1px"
              borderColor="grey.100"
              padding="12px"
              display="flex"
              justifyContent="space-evenly"
              gap="16px"
            >
              {daysOfWeek.map((day, index) => (
                <Box
                  key={index}
                  className="streak__table-element"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  gap="4px"
                >
                  <Text key={index} textAlign="center">
                    {day}
                  </Text>
                  {tickData[index] ? (
                    <Image
                      key={index}
                      src="/assets/checkbox.svg"
                      width="20px"
                      height="20px"
                    ></Image>
                  ) : (
                    ""
                  )}
                </Box>
              ))}
            </Box>
            <Box marginBottom="18px" mt="12px">
              <Text textAlign="center">
                {STREAK_FOOTER[appLanguage] ?? STREAK_FOOTER[AppLanguage.ENGLISH]}
              </Text>
            </Box>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default ModalMoodStreak;
