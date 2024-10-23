import { Box, Image, Text } from "@chakra-ui/react";
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
      <Image
        onClick={props.goToNextUser}
        src="/assets/logo-heartbeat.svg"
        width="128px"
      ></Image>
      <Text onClick={resetDB}>PLACEHOLDER TEXT TO RESET DB</Text>
    </Box>
  );
}

export default Brand;
