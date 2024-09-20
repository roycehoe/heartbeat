import { Box, Flex, Grid, GridItem } from "@chakra-ui/react";

function HomePage() {
  return (
    <Box
      bg="tomato"
      border="24px solid"
      borderColor="white"
      width="100vw"
      height="100vh"
      color="white"
    >
      <Flex
        gap="24px"
        bg="slate.200"
        justifyContent="space-evenly"
        flexDirection="column"
        height="100%"
      >
        <Box bg="brand.primary.300" className="brand-logo">
          <Flex justifyContent="center">
            <Box bg="brand.primary.200">
              <p>Our Logo</p>
            </Box>
          </Flex>
        </Box>

        <Box bg="green.100" className="dashboard" flex="1">
          <Flex width="100%" height="100%">
            <Grid
              templateAreas={`"plant calendar calendar"
                              "plant calendar calendar"
                              "plant calendar calendar"
                              "plant calendar calendar"
                              "happy-btn ok-btn sad-btn"`}
              gridTemplateColumns="auto"
              gridTemplateRows="auto"
              gap="24px"
              bg="brand.primary.200"
              flex="1"
            >
              <GridItem area="plant" bg="red.200" m={4}>
                Plant
              </GridItem>
              <GridItem area="calendar" bg="red.200" m={4}>
                Calendar
              </GridItem>
              <GridItem area="happy-btn" bg="red.200" m={4}>
                Happy
              </GridItem>
              <GridItem area="ok-btn" bg="red.200" m={4}>
                Ok
              </GridItem>
              <GridItem area="sad-btn" bg="red.200" m={4}>
                Sad
              </GridItem>
            </Grid>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}

export default HomePage;
