import {
  Box,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { jwtDecode } from "jwt-decode";
import { AppLanguage } from "../api/user";

interface decodedTokenData {
  user_id: string;
  app_language: AppLanguage;
  exp: number;
}

function StreakCountDisplay(props: {
  streakCount: number;
  appLanguage: AppLanguage;
}) {
  if (props.appLanguage === AppLanguage.ENGLISH) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-evenly"
        alignItems="center"
      >
        <Box>
          <Text fontWeight="600" fontSize="86px" color="#25AC51" lineHeight="1">
            {props.streakCount}
          </Text>
        </Box>
        <Box>
          <Text fontWeight="600" fontSize="32px" color="#25AC51">
            day streak!
          </Text>
        </Box>
      </Box>
    );
  }
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-evenly"
      alignItems="center"
    >
      <Box>
        <Text fontWeight="600" fontSize="32px" color="#25AC51">
          连续打卡
        </Text>
      </Box>
      <Box>
        <Text fontWeight="600" fontSize="86px" color="#25AC51" lineHeight="1">
          {props.streakCount}天!
        </Text>
      </Box>
    </Box>
  );
}

function ModalMoodStreak({
  isOpen,
  handleClose,
  daysOfWeek,
  tickData,
  streak,
}: {
  isOpen: boolean;
  handleClose: () => void;
  daysOfWeek: string[];
  tickData: boolean[];
  streak: number;
}) {
  const tokenData = localStorage.getItem("token");
  if (!tokenData) {
    return;
  }
  const { app_language } = jwtDecode(tokenData) as decodedTokenData;
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
          <StreakCountDisplay streakCount={streak} appLanguage={app_language} />

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
                {app_language === AppLanguage.ENGLISH
                  ? "Keep your streak going by checking in tomorrow!"
                  : "记得明天打卡，继续保持连续哦"}
              </Text>
            </Box>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default ModalMoodStreak;
