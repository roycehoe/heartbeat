// import { Box, Fade } from "@chakra-ui/react";
// import moment from "moment";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { DEFAULT_USER_CREDENTIALS } from "../../api/constants";
// import {
//   DashboardResponse,
//   getUserClaimGiftResponse,
//   getUserMoodResponse,
//   MoodValue,
// } from "../../api/user";
// import Display from "./Display";
// import MoodBtns from "./MoodBtns";

// function HomePage() {
//   const [currentIndex, setCurrentIndex] = useState<number>(() => {
//     const storedIndex = localStorage.getItem("currentIndex");
//     return storedIndex !== null ? Number(storedIndex) : 0;
//   });
//   const [dashboardData, setDashboardData] = useState<DashboardResponse>();
//   const [moodMessage, setMoodMessage] = useState<string>("");
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!localStorage.getItem("token")) {
//       navigate("/login");
//       return;
//     }

//     const loadDashboard = async () => {
//       setIsLoading(true);
//       const dashboardResponse = await getUserDashboardResponse();
//       setDashboardData(dashboardResponse);
//       setIsLoading(false);
//     };
//     loadDashboard();

//     const intervalId = setInterval(() => {
//       loadDashboard();
//     }, 60 * 60 * 1000);
//     return () => clearInterval(intervalId);
//   }, [currentIndex]);

//   const onMoodButtonClick = async (mood: MoodValue) => {
//     const userMoodResponse = await getUserMoodResponse({ mood: mood });
//     setMoodMessage(userMoodResponse.mood_message);
//     setDashboardData(userMoodResponse);
//   };

//   const onClaimGiftBtnClick = async () => {
//     const userClaimGiftResponse = await getUserClaimGiftResponse();
//     setDashboardData(userClaimGiftResponse);
//   };

//   const incrementIndex = () => {
//     const nextIndex =
//       currentIndex === DEFAULT_USER_CREDENTIALS.length - 1
//         ? 0
//         : currentIndex + 1;
//     setCurrentIndex(nextIndex);
//     localStorage.setItem("currentIndex", nextIndex.toString());
//   };

//   if (isLoading || !dashboardData) {
//     return (
//       <Box
//         width="100vw"
//         height="100vh"
//         display="flex"
//         flexDirection="column"
//         className="page"
//         bg="url('/assets/loading.svg')"
//       ></Box>
//     );
//   }
//   return (
//     <Box
//       width="100%"
//       height="100%"
//       display="flex"
//       flexDirection="column"
//       className="page"
//     >
//       <Fade in={!isLoading} style={{ width: "100%", height: "100%" }}>
//         <Box
//           display="flex"
//           flexDirection="column"
//           justifyContent="space-between"
//           height="100%"
//           className="page--group"
//         >
//           <Box height="50%">
//             <Display
//               dashboardData={dashboardData}
//               goToNextUser={incrementIndex}
//               onClaimGiftBtnClick={onClaimGiftBtnClick}
//             ></Display>
//           </Box>
//           <Box height="50%">
//             <MoodBtns
//               isDisabled={!dashboardData.can_record_mood}
//               moodsCreatedAt={dashboardData.moods.map((mood) =>
//                 moment(mood.created_at)
//               )}
//               streak={dashboardData.consecutive_checkins}
//               onClick={onMoodButtonClick}
//               moodMessage={moodMessage}
//             ></MoodBtns>
//           </Box>
//         </Box>
//       </Fade>
//     </Box>
//   );
// }

// export default HomePage;

import { Box, Fade } from "@chakra-ui/react";
import moment from "moment";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DEFAULT_USER_CREDENTIALS } from "../../api/constants";
import {
  DashboardResponse,
  getUserClaimGiftResponse,
  getUserMoodResponse,
  MoodValue,
  useGetUserDashboardResponse,
} from "../../api/user"; // ← Make sure this is the correct path
import Display from "./Display";
import MoodBtns from "./MoodBtns";

function HomePage() {
  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    const storedIndex = localStorage.getItem("currentIndex");
    return storedIndex !== null ? Number(storedIndex) : 0;
  });

  const [moodMessage, setMoodMessage] = useState<string>("");
  const navigate = useNavigate();

  const {
    data: dashboardData,
    isLoading,
    error,
    refetch,
  } = useGetUserDashboardResponse();

  const onMoodButtonClick = async (mood: MoodValue) => {
    const userMoodResponse = await getUserMoodResponse({ mood });
    setMoodMessage(userMoodResponse.mood_message);
    refetch(); // Refresh dashboard after mood update
  };

  const onClaimGiftBtnClick = async () => {
    await getUserClaimGiftResponse();
    refetch(); // Refresh dashboard after claiming gift
  };

  const incrementIndex = () => {
    const nextIndex =
      currentIndex === DEFAULT_USER_CREDENTIALS.length - 1
        ? 0
        : currentIndex + 1;
    setCurrentIndex(nextIndex);
    localStorage.setItem("currentIndex", nextIndex.toString());
  };

  if (error) {
    return navigate("/login");
  }
  if (!localStorage.getItem("token")) {
    return navigate("/login");
  }
  if (isLoading || !dashboardData) {
    return (
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        flexDirection="column"
        className="page"
        bg="url('/assets/loading.svg')"
      />
    );
  }

  return (
    <Box
      width="100%"
      height="100%"
      display="flex"
      flexDirection="column"
      className="page"
    >
      <Fade in={!isLoading} style={{ width: "100%", height: "100%" }}>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          height="100%"
          className="page--group"
        >
          <Box height="50%">
            <Display
              dashboardData={dashboardData}
              goToNextUser={incrementIndex}
              onClaimGiftBtnClick={onClaimGiftBtnClick}
            />
          </Box>
          <Box height="50%">
            <MoodBtns
              isDisabled={!dashboardData.can_record_mood}
              moodsCreatedAt={dashboardData.moods.map((mood) =>
                moment(mood.created_at)
              )}
              streak={dashboardData.consecutive_checkins}
              onClick={onMoodButtonClick}
              moodMessage={moodMessage}
            />
          </Box>
        </Box>
      </Fade>
    </Box>
  );
}

export default HomePage;
