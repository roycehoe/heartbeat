import { Box, Text } from "@chakra-ui/react";
import { resetDB } from "../api/user";

function Brand(props: { goToNextUser: () => void }) {
  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="flex-end"
      alignItems="center"
      gap={1}
    >
      <img
        onClick={props.goToNextUser}
        src="/src/assets/logo-heartbeat.svg"
      ></img>
      <Text fontWeight={800}>|</Text>
      <img
        onClick={async () => await resetDB()}
        src="/src/assets/logo-bfg.svg"
      ></img>
    </Box>
  );
}

export default Brand;
