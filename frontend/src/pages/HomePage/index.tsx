import { Box } from "@chakra-ui/react";
import Display from "./Display";
import EmotionBtns from "./EmotionBtns";
import { MOCK_DASHBOARD_API_RESPONSE } from "../../api/constants";


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
        <Display dashboardData={MOCK_DASHBOARD_API_RESPONSE}></Display>
        <EmotionBtns></EmotionBtns>
      </Box>
    </Box>
  );
}

export default HomePage;
