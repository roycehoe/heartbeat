import { Box } from "@chakra-ui/react";
import moment from "moment";
import { MOCK_DASHBOARD_API_RESPONSE } from "../../api/constants";
import Display from "./Display";
import MoodBtns from "./MoodBtns";

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
        <MoodBtns
          isDisabled={!MOCK_DASHBOARD_API_RESPONSE.can_record_mood}
          moodsCreatedAt={MOCK_DASHBOARD_API_RESPONSE.moods.map((mood) =>
            moment(mood.created_at)
          )}
          streak={MOCK_DASHBOARD_API_RESPONSE.consecutive_checkins}
        ></MoodBtns>
      </Box>
    </Box>
  );
}

export default HomePage;
