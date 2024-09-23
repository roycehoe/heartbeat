import { Box } from "@chakra-ui/react";

function HomePage() {
  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      bg="brand.primary.400"
      className="page"
    >
      <Box
        display="flex"
        flexDirection="column"
        bg="brand.secondary.400"
        marginX="56px"
        marginTop="68px"
        marginBottom="32px"
        gap="60px"
        justifyContent="space-between"
        height="100%"
        className="page--group"
      >
        <Box
          display="flex"
          bg="green.400"
          className="dashboard--top"
          height="100%"
        >
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
      </Box>
    </Box>
  );
}

export default HomePage;
