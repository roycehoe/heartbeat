import { Box, Flex, Grid, GridItem } from "@chakra-ui/react";
import { RangeCalendar } from "@opengovsg/design-system-react";
import { getUserDashboardResponse } from "../api/dashboard";
import MoodBtn from "../components";

function HomePage() {
  const handleButtonClick = async () => {
    const result = await getUserDashboardResponse(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjE3MjcyNjU2MTR9.-WWNynebPYcoQRmF2Y5tB8koNRtiFGEWvn4-teWXDFo"
    );
    console.log(result);
  };

  return (
    <Box width="100vw" height="100vh" display="flex" flexDirection="column">
      <Box
        bg="tomato"
        border="24px solid"
        borderColor="white"
        className="thisOne"
        flexGrow="1"
        overflow="hidden"
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
                gridTemplateColumns="1fr 1fr 1fr"
                gridTemplateRows="auto"
                gap="24px"
                bg="brand.primary.200"
                flex="1"
              >
                <GridItem area="plant" bg="red.200" m={4}>
                  <iframe
                    src="https://giphy.com/embed/Vi5TUmZz8LZb95j2xb"
                    width="100%"
                    height="100%"
                    allowFullScreen
                  ></iframe>
                </GridItem>
                <GridItem area="calendar" bg="red.200" m={4}>
                  <RangeCalendar
                    showTodayButton={false}
                    width="100%"
                    height="100%"
                    monthsToDisplay={1}
                  ></RangeCalendar>
                </GridItem>
                <GridItem area="happy-btn" bg="red.200" m={4}>
                  <MoodBtn content="Happy"></MoodBtn>
                </GridItem>
                <GridItem area="ok-btn" bg="red.200" m={4}>
                  <MoodBtn content="Ok" onClick={handleButtonClick}></MoodBtn>
                </GridItem>
                <GridItem area="sad-btn" bg="red.200" m={4}>
                  <MoodBtn content="Sad"></MoodBtn>
                </GridItem>
              </Grid>
            </Flex>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}

export default HomePage;
