import {
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { Button, BxLoader } from "@opengovsg/design-system-react";
import { useEffect, useState } from "react";
import { MOCK_DASHBOARD_API_RESPONSE } from "../api/constants";
import {
  DashboardResponse,
  getUserDashboardResponse,
  getUserMoodResponse,
  MoodValue,
} from "../api/dashboard";
import Brand from "../components/Brand";
import CalendarDateRange from "../components/CalendarDateRange";
import Coins from "../components/Coins";
import MoodBtn from "../components/MoodBtn";
import Tree from "../components/Tree";

const MoodBtnsProps = [
  {
    icon: <img src="/src/assets/logo-heartbeat.svg"></img>,
    value: MoodValue.HAPPY,
  },
  { icon: <img src="/src/assets/logo-bfg.svg"></img>, value: MoodValue.HAPPY },
  { icon: <img src="/src/assets/happy.svg"></img>, value: MoodValue.HAPPY },
  { icon: <img src="/src/assets/ok.svg"></img>, value: MoodValue.OK },
  { icon: <img src="/src/assets/sad.svg"></img>, value: MoodValue.SAD },
];

function DashboardModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button onClick={onOpen}>Open Modal</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corrupti
            impedit quisquam quis, aspernatur laboriosam nemo, maxime
            accusantium voluptates cupiditate ducimus ipsa doloremque doloribus
            atque et natus placeat nihil praesentium assumenda?
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost">Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

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
      <DashboardModal></DashboardModal>
      <Tree treeDisplayState={1}></Tree>
      <CalendarDateRange
        dateRange={dashboardData.moods.map((mood) => {
          return new Date(mood.created_at);
        })}
      ></CalendarDateRange>
      <Coins coinCount={100}></Coins>
      <Brand></Brand>
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
