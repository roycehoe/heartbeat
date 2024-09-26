import {
  Box,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

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
  streak: number[];
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      isCentered
      motionPreset="slideInBottom"
    >
      <ModalOverlay />
      <ModalContent>
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
          <Box>
            <Text
              fontWeight="600"
              fontSize="86px"
              color="#25AC51"
              lineHeight="1"
            >
              {streak}
            </Text>
          </Box>
          <Box>
            <Text fontWeight="600" fontSize="32px" color="#25AC51">
              day streak!
            </Text>
          </Box>

          <Box>
            <Table variant="unstyled" size="sm">
              <Thead>
                <Tr>
                  {daysOfWeek.map((day, index) => (
                    <Th key={index} textAlign="center">
                      {day}
                    </Th>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  {tickData.map((hasTick, index) => (
                    <Td key={index} textAlign="center">
                      {hasTick ? <img src="/assets/checkbox.svg"></img> : ""}
                    </Td>
                  ))}
                </Tr>
              </Tbody>
            </Table>
          </Box>

          <Box marginBottom="18px">
            Keep your streak going by checking in tomorrow
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default ModalMoodStreak;
