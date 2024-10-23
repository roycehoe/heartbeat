import { Box, Image, Text } from "@chakra-ui/react";

function OgpFooter() {
  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="flex-end"
      gap="6px"
      alignItems="center"
      mr="6px"
    >
      <Text textStyle="4xl">Built by</Text>
      <Image src="/assets/ogp-logo.svg"></Image>
    </Box>
  );
}

export default OgpFooter;
