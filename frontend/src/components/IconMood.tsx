import { Box } from "@chakra-ui/react";
import { SelectedMood } from "../api/types";

export const IconMood = (props: {
  mood: SelectedMood | undefined;
  isToday: boolean;
}) => {
  if (props.mood === SelectedMood.HAPPY) {
    return (
      <Box display="flex" justifyContent="center">
        <img src="/assets/icon/happy.svg" />
      </Box>
    );
  }
  if (props.mood === SelectedMood.OK) {
    return (
      <Box display="flex" justifyContent="center">
        <img src="/assets/icon/ok.svg" />
      </Box>
    );
  }
  if (props.mood === SelectedMood.SAD) {
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
