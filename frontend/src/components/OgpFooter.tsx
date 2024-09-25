import { Box } from "@chakra-ui/react";

function OgpFooter() {
  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="flex-end"
      gap="8px"
      alignItems="center"
      mr="24px"
    >
      <p>Built by</p>
      <img src="/assets/ogp-logo.svg"></img>
    </Box>
  );
}

export default OgpFooter;
