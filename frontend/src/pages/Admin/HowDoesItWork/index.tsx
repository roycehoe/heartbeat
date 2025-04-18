import { Box, Heading, IconButton, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { IconArrowLeft } from "../../../components/IconArrowLeft";

export function HowDoesItWork() {
  const navigate = useNavigate();

  const handleBackIconClick = () => {
    navigate(`/admin/create-user`);
  };
  return (
    <Box
      width="100%"
      height="100%"
      display="flex"
      flexDirection="column"
      className="page"
    >
      <Box
        className="page"
        margin="18px"
        paddingBottom="24px"
        display="flex"
        flexDir="column"
        gap="24px"
      >
        <Box display="flex" gap="8px" justifyContent="space-between">
          <IconButton
            onClick={handleBackIconClick}
            isRound={true}
            variant="solid"
            aria-label="Done"
            icon={<IconArrowLeft />}
          />

          <Box display="flex" justifyContent="center"></Box>
        </Box>
        <Box display="flex" gap="16px" flexDirection="column">
          <Heading size="sm">How does it work?</Heading>
        </Box>
        <Box display="flex" gap="8px" flexDirection="column">
          <Heading size="xs">Lamenting</Heading>
          <Text size="sm">
            Tomorrow, and tomorrow, and tomorrow, Creeps in this petty pace from
            day to day, To the last syllable of recorded time; And all our
            yesterdays have lighted fools The way to dusty death.
          </Text>
        </Box>
        <Box display="flex" gap="8px" flexDirection="column">
          <Heading size="xs">Contemplation</Heading>
          <Text size="sm">
            Out, out, brief candle! Life's but a walking shadow, a poor player,
            That struts and frets his hour upon the stage, And then is heard no
            more.
          </Text>
        </Box>
        <Box display="flex" gap="8px" flexDirection="column">
          <Heading size="xs">Acceptance</Heading>
          <Text size="sm">
            It is a tale Told by an idiot, full of sound and fury, Signifying
            nothing.
          </Text>
        </Box>
      </Box>
    </Box>
  );
}
