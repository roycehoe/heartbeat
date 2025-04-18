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
        </Box>
        <Box display="flex" gap="16px" flexDirection="column">
          <Heading size="sm">About</Heading>
        </Box>
        <Box display="flex" gap="16px" flexDirection="column">
          <Box display="flex" gap="8px" flexDirection="column">
            <Heading size="xs">How does it work?</Heading>
            <Text size="sm">
              HeartBeat is a simple, non-intrusive app that helps seniors stay
              connected and gives caregivers peace of mind—every single day.
            </Text>
          </Box>
          <Box display="flex" gap="8px" flexDirection="column">
            <Heading size="xs">One-Tap Daily Check-in</Heading>
            <Text size="sm">
              With just a single tap, seniors can easily let their loved ones
              know they’re okay. Simply open the HeartBeat app and tap the
              check-in button to share your status and how you're feeling.
            </Text>
          </Box>
          <Box display="flex" gap="8px" flexDirection="column">
            <Heading size="xs">Peace of Mind at a Glance</Heading>
            <Text size="sm">
              After a check-in, caregivers can easily see their loved one’s
              status in the app—offering quiet reassurance that all is well.
            </Text>
          </Box>
          <Box display="flex" gap="8px" flexDirection="column">
            <Heading size="xs">Smart Safety Alerts</Heading>
            <Text size="sm">
              If a check-in isn’t received by a set time, HeartBeat
              automatically sends an alert to designated caregivers—serving as a
              gentle but effective safety net.
            </Text>
          </Box>
          <Box display="flex" gap="8px" flexDirection="column">
            <Heading size="xs">Timely Help When It Matters</Heading>
            <Text size="sm">
              This proactive system ensures that caregivers are notified early,
              so they can step in quickly if something seems wrong—enhancing
              safety and support for everyone involved.
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
