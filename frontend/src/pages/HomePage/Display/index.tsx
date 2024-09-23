import { Box } from "@chakra-ui/react";

function Display() {
  return (
    <Box display="flex" bg="green.400" className="dashboard--top" height="100%">
      <Box
        bg="yellow.400"
        className="dashboard--top--left"
        width="50%"
        display="flex"
        gap="42px"
      >
        <Box bg="skin.2base" className="dashboard--top--left">
          Coins
        </Box>
        <Box bg="skin.2base" className="dashboard--top--left" width="100%">
          <p>Tree!</p>
        </Box>
      </Box>
      <Box
        bg="red.400"
        className="dashboard--top--right"
        display="flex"
        flexDirection="column"
        width="50%"
        gap="56px"
      >
        <Box
          bg="slate.200"
          className="dashboard--top--left"
          display="flex"
          justifyContent="flex-end"
        >
          <p>logo</p>
        </Box>
        <Box
          bg="slate.200"
          className="dashboard--top--left"
          display="flex"
          justifyContent="flex-end"
        >
          <p>calendar</p>
        </Box>
      </Box>
    </Box>
  );
}

export default Display;
