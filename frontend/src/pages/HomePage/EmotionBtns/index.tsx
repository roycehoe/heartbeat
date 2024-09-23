import { Box } from "@chakra-ui/react";

function EmotionBtns() {
  return (
    <Box
      display="flex"
      bg="green.400"
      className="dashboard--bottom"
      justifyContent="space-between"
      gap="48px"
      height="100%"
      maxHeight="188px"
    >
      <Box bg="red.400" width="100%">
        button 1
      </Box>
      <Box bg="red.400" width="100%">
        button 2
      </Box>
      <Box bg="red.400" width="100%">
        button 3
      </Box>
    </Box>
  );
}

export default EmotionBtns;
