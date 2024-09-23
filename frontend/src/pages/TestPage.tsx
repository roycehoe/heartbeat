import { Box } from "@chakra-ui/react";
import { BxLoader } from "@opengovsg/design-system-react";
import { useEffect, useState } from "react";
import { MOCK_DASHBOARD_API_RESPONSE } from "../api/constants";
import {
  DashboardResponse,
  getUserDashboardResponse,
  getUserMoodResponse,
  MoodValue,
} from "../api/dashboard";
import CalendarDateRange from "../components/CalendarDateRange";
import MoodBtn from "../components/MoodBtn";

const MoodBtnsProps = [
  { icon: <img src="/src/assets/happy.svg"></img>, value: MoodValue.HAPPY },
  { icon: <img src="/src/assets/ok.svg"></img>, value: MoodValue.OK },
  { icon: <img src="/src/assets/sad.svg"></img>, value: MoodValue.SAD },
];

function HomePage() {
  const [dashboardData, setDashboardData] = useState({} as DashboardResponse);
  // const [isShowModal, setDashboardData] = useState({} as DashboardResponse);

  const sendMoodData = async (mood: MoodValue) => {
    const userMoodResponse = await getUserMoodResponse("token here", {
      mood: mood,
    });
    setDashboardData(userMoodResponse);
  };

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
      <Box display="flex" flexDirection="row">
        {MoodBtnsProps.map((moodBtnProps) => {
          return (
            <MoodBtn
              icon={moodBtnProps.icon}
              // Call API here on click and rerender
              onClick={() => console.log(moodBtnProps.value)}
            ></MoodBtn>
          );
        })}
      </Box>
    </Box>
  );
}

export default HomePage;
