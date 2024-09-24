// import { Box } from "@chakra-ui/react";
// import moment from "moment";
// import { useEffect, useState } from "react";
// import {
//   DEFAULT_USER_CREDENTIALS,
//   MOCK_DASHBOARD_API_RESPONSE,
// } from "../../api/constants";
// import { getUserLoginResponse, LoginRequest } from "../../api/user";
// import Display from "./Display";
// import MoodBtns from "./MoodBtns";

// function HomePage() {
//   const [currentIndex, setCurrentIndex] = useState<number>(0);

//   // Function to log in a user with a specific LoginRequest
//   async function login(loginRequest: LoginRequest): Promise<void> {
//     const loginResponse = await getUserLoginResponse(loginRequest);
//     localStorage.removeItem("token");
//     localStorage.setItem("token", loginResponse.access_token);
//   }

//   // On component mount, retrieve index from sessionStorage
//   useEffect(() => {
//     const storedIndex = sessionStorage.getItem("currentIndex");
//     if (storedIndex !== null) {
//       setCurrentIndex(Number(storedIndex)); // Use the stored index
//     }
//   }, []);

//   // When currentIndex changes, log in and store the index in sessionStorage
//   useEffect(() => {
//     if (DEFAULT_USER_CREDENTIALS.length > 0) {
//       sessionStorage.setItem("currentIndex", currentIndex.toString()); // Store current index
//       login(DEFAULT_USER_CREDENTIALS[currentIndex]); // Log in the user
//     }
//   }, [currentIndex]);

//   // Function to increment the index and loop through the credentials
//   const incrementIndex = () => {
//     setCurrentIndex((prevIndex) =>
//       prevIndex === DEFAULT_USER_CREDENTIALS.length - 1 ? 0 : prevIndex + 1
//     );
//   };

//   return (
//     <Box
//       width="100vw"
//       height="100vh"
//       display="flex"
//       flexDirection="column"
//       bg="brand.primary.400"
//       className="page"
//     >
//       <Box
//         display="flex"
//         flexDirection="column"
//         bg="brand.secondary.400"
//         marginX="56px"
//         marginTop="68px"
//         marginBottom="32px"
//         gap="60px"
//         justifyContent="space-between"
//         height="100%"
//         className="page--group"
//       >
//         <Display
//           dashboardData={MOCK_DASHBOARD_API_RESPONSE}
//           goToNextUser={incrementIndex}
//         ></Display>
//         <MoodBtns
//           isDisabled={!MOCK_DASHBOARD_API_RESPONSE.can_record_mood}
//           moodsCreatedAt={MOCK_DASHBOARD_API_RESPONSE.moods.map((mood) =>
//             moment(mood.created_at)
//           )}
//           streak={MOCK_DASHBOARD_API_RESPONSE.consecutive_checkins}
//         ></MoodBtns>
//       </Box>
//     </Box>
//   );
// }

// export default HomePage;
import { Box } from "@chakra-ui/react";
import moment from "moment";
import { useEffect, useState } from "react";
import {
  DEFAULT_USER_CREDENTIALS,
  MOCK_DASHBOARD_API_RESPONSE,
} from "../../api/constants";
import { getUserLoginResponse, LoginRequest } from "../../api/user";
import Display from "./Display";
import MoodBtns from "./MoodBtns";

function HomePage() {
  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    // Retrieve stored index from sessionStorage, or use 0 as the default
    const storedIndex = localStorage.getItem("currentIndex");
    return storedIndex !== null ? Number(storedIndex) : 0;
  });

  async function login(loginRequest: LoginRequest): Promise<void> {
    const loginResponse = await getUserLoginResponse(loginRequest);
    localStorage.setItem("token", loginResponse.access_token);
  }

  useEffect(() => {
    if (DEFAULT_USER_CREDENTIALS.length > 0) {
      login(DEFAULT_USER_CREDENTIALS[currentIndex]);
    }
  }, [currentIndex]);

  const incrementIndex = () => {
    const nextIndex =
      currentIndex === DEFAULT_USER_CREDENTIALS.length - 1
        ? 0
        : currentIndex + 1;
    setCurrentIndex(nextIndex);
    localStorage.setItem("currentIndex", nextIndex.toString());
  };

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
        <Display
          dashboardData={MOCK_DASHBOARD_API_RESPONSE}
          goToNextUser={incrementIndex}
        ></Display>
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
