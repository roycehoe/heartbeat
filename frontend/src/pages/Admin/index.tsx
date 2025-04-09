import {
  Box,
  Card,
  Fade,
  Flex,
  Grid,
  Heading,
  Image,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { Button } from "@opengovsg/design-system-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DashboardResponse,
  getAdminDashboardResponse,
  getUserMoodResponse,
  Mood,
  MoodValue,
} from "../../api/user";

import { Table } from "@chakra-ui/react";

const COLOR_TAG = {
  BAD: "#FF3B30",
  UNRESPONSIVE: "#AF52DE",
  EMPTY_STATE: "#30B0C7",
  GOOD: "#34C759",
};

function isSameDay(firstDate: Date, secondDate: Date) {
  return (
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate()
  );
}

function getColorTag(user: DashboardResponse) {
  const daysToMoodMap = [0, 1, 2, 3].map((day) => {
    return { day: getDayBefore(day), mood: undefined };
  });
}

function getLastFourDaysMood(dashboardResponse: DashboardResponse) {
  // Get today's date once (based on local time).
  const today = new Date();
  const results = [];

  // Generate results for today and the three previous days.
  for (let i = 0; i < 4; i++) {
    // Create a new Date instance for the specific day.
    const day = new Date(today);
    day.setDate(today.getDate() - i);

    // Format date as "YYYY-MM-DD"
    const dateStr = day.toISOString().split("T")[0];

    // Find a mood that has a created_at date matching the day.
    // Assumes created_at is in a similar ISO string format such that the date portion is at the beginning.
    const moodRecord = dashboardResponse.moods.find((mood) =>
      mood.created_at.startsWith(dateStr)
    );

    // Push the result for this day.
    results.push({
      date: dateStr,
      mood: moodRecord ? moodRecord.mood : undefined,
    });
  }

  return results;
}

const TableUserMoodCellDisplay = (props: {
  mood: MoodValue | undefined;
  isToday: boolean;
}) => {
  if (props.mood === MoodValue.HAPPY) {
    return (
      <Box display="flex" justifyContent="center">
        <img src="/assets/icon/happy.svg" />
      </Box>
    );
  }
  if (props.mood === MoodValue.OK) {
    return (
      <Box display="flex" justifyContent="center">
        <img src="/assets/icon/ok.svg" />
      </Box>
    );
  }
  if (props.mood === MoodValue.SAD) {
    return (
      <Box display="flex" justifyContent="center">
        <img src="/assets/icon/sad.svg" />
      </Box>
    );
  }
  if (!props.isToday) {
    return (
      <Box display="flex" justifyContent="center">
        <img src="/assets/icon/cross.svg" />
      </Box>
    );
  }
  return (
    <Box display="flex" justifyContent="center">
      -
    </Box>
  );
};

function getDayBefore(daysBefore: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - daysBefore);
  return date;
}

const TableMoodRowDisplay = (props: { user: DashboardResponse }) => {
  return (
    <Tr>
      <Td p={0}>
        <Flex>
          <Box width="12px" bg={COLOR_TAG.UNRESPONSIVE} />
          <Box p={3} width="100%">
            <Text>{props.user.username}</Text>
          </Box>
        </Flex>
      </Td>
      {[0, 1, 2, 3].map((daysBefore) => {
        const cellDate = getDayBefore(daysBefore);
        const userMood = props.user.moods.find((mood) =>
          isSameDay(new Date(mood.created_at), cellDate)
        );

        return (
          <Td>
            <Box display="flex" justifyContent="center">
              <TableUserMoodCellDisplay
                mood={userMood?.mood}
                isToday={daysBefore === 0}
              />
            </Box>
          </Td>
        );
      })}
    </Tr>
  );
};

const DashboardTable = (props: { dashboardData: DashboardResponse[] }) => {
  return (
    <TableContainer>
      <Table size="sm" variant="simple">
        <Thead>
          <Tr>
            <Th textTransform="none">Name</Th>
            <Th textTransform="none" colSpan={5} textAlign="center">
              Mood snapshot
            </Th>
          </Tr>
          <Tr>
            <Th textTransform="none" py="1px"></Th>
            <Th textTransform="none" py="1px" fontSize={8}>
              Today
            </Th>
            <Th textTransform="none" py="1px" fontSize={8}>
              1d ago
            </Th>
            <Th textTransform="none" py="1px" fontSize={8}>
              2d ago
            </Th>
            <Th textTransform="none" py="1px" fontSize={8}>
              3d ago
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {props.dashboardData.map((user) => {
            return <TableMoodRowDisplay user={user} />;
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

function Admin() {
  const [dashboardData, setDashboardData] = useState<DashboardResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const loadDashboardData = async () => {
    setIsLoading(true);
    const dashboardResponse = await getAdminDashboardResponse();
    setDashboardData(dashboardResponse);
    setIsLoading(false);
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }
    loadDashboardData();
  }, []);

  if (isLoading || !dashboardData) {
    return (
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        flexDirection="column"
        className="page"
        bg="url('/assets/loading.svg')"
      ></Box>
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
          className="page"
          margin="18px"
          display="flex"
          flexDir="column"
          gap="24px"
        >
          <Button
            onClick={() => console.log(getLastFourDaysMood(dashboardData[0]))}
          >
            Click me
          </Button>
          <Box display="flex" gap="8px" alignItems="center">
            <Image src="/assets/icon/heart.svg"></Image>
            <Heading size="sm" color="#007AFF">
              HeartBeat
            </Heading>
          </Box>
          <Box>
            <Heading size="sm">Persons I care for</Heading>
          </Box>

          <Grid templateColumns="repeat(2, 1fr)" gap="12px">
            <Card borderLeft="12px solid" borderLeftColor={COLOR_TAG.BAD}>
              <Box my="12px" mx="8px">
                <Heading size="md">2</Heading>
                <Text fontSize="12px">In poor mental state</Text>
              </Box>
            </Card>
            <Card
              borderLeft="12px solid"
              borderLeftColor={COLOR_TAG.UNRESPONSIVE}
            >
              <Box my="12px" mx="8px">
                <Heading size="md">1</Heading>
                <Text fontSize="12px">Unresponsive</Text>
              </Box>
            </Card>
          </Grid>
          <DashboardTable dashboardData={dashboardData}></DashboardTable>
          <Button size="xs">Add another person</Button>
        </Box>
      </Fade>
    </Box>
  );
}

export default Admin;
