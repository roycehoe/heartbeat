import { Box, Text } from "@chakra-ui/react";

function Brand() {
  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="flex-end"
      alignItems="center"
      gap={1}
    >
      <img src="/src/assets/logo-heartbeat.svg"></img>
      <Text fontWeight={800}>|</Text>
      <img src="/src/assets/logo-bfg.svg"></img>
    </Box>
  );
}

export default Brand;
