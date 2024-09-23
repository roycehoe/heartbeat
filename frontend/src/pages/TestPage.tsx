import { Box } from "@chakra-ui/react";
import { BxLoader } from "@opengovsg/design-system-react";
import { useEffect, useState } from "react";
import { MOCK_DASHBOARD_API_RESPONSE } from "../api/constants";
import { DashboardResponse, getUserDashboardResponse } from "../api/dashboard";
import CalendarDateRange from "../components/CalendarDateRange";
import MoodBtn from "../components/MoodBtn";

function HomePage() {
  const [dashboardData, setDashboardData] = useState({} as DashboardResponse);

  useEffect(() => {
    // const fetchUserDashboard = async () => {
    //   const result = await getUserDashboardResponse("token here");
    //   setDashboard(result);
    // };
    // fetchUserDashboard()
    setDashboardData(MOCK_DASHBOARD_API_RESPONSE);
  }, []);
  if (!dashboardData.moods) {
    return <BxLoader></BxLoader>;
  }

  return (
    <Box width="100vw" height="100vh" display="flex" flexDirection="column">
      <CalendarDateRange
        dateRange={dashboardData.moods.map((mood) => {
          return new Date(mood.created_at);
        })}
      ></CalendarDateRange>
      <div>
        <MoodBtn
          icon={<img src="/src/assets/ok.svg"></img>}
          onClick={() => console.log("hello world")}
        ></MoodBtn>
      </div>
    </Box>
  );
}

export default HomePage;
