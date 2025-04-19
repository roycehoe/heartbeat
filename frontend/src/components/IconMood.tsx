import { Box } from "@chakra-ui/react";
import { MoodValue } from "../api/user";

export const IconMood = (props: {
  mood: MoodValue | undefined;
  isToday: boolean;
}) => {
  if (props.mood === MoodValue.HAPPY) {
    return (
      <Box display="flex" justifyContent="center">
        <img src="/assets/icon/happy.svg" />
      </Box>
    );
  }
  if (props.mood === MoodValue.OK) {
    return (
      <Box display="flex" justifyContent="center">
        <img src="/assets/icon/ok.svg" />
      </Box>
    );
  }
  if (props.mood === MoodValue.SAD) {
    return (
      <Box display="flex" justifyContent="center">
        <img src="/assets/icon/sad.svg" />
      </Box>
    );
  }
  if (!props.isToday) {
    return (
      <Box display="flex" justifyContent="center">
        <img src="/assets/icon/cross.svg" />
      </Box>
    );
  }
  return (
    <Box display="flex" justifyContent="center">
      -
    </Box>
  );
};
