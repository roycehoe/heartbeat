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
  MoodValue,
} from "../../api/user";

import { Table } from "@chakra-ui/react";
import { getLastFourDaysMood, UserMoodDate } from "./utils";

const POOR_MENTAL_HEALTH_STREAK_THRESHOLD = 2;

enum ColorTag {
  BAD = "#FF3B30",
  UNRESPONSIVE = "#AF52DE",
  EMPTY_STATE = "#30B0C7",
  GOOD = "#34C759",
}

function getColorTag(user: DashboardResponse): ColorTag {
  const lastFourDaysMood = getLastFourDaysMood(user);
  if (hasPoorMentalState(lastFourDaysMood)) {
    return ColorTag.BAD;
  }
  if (isUnresponsive(lastFourDaysMood)) {
    return ColorTag.UNRESPONSIVE;
  }
  return ColorTag.GOOD;
}

function hasPoorMentalState(
  moodDates: UserMoodDate[],
  threshold: number = POOR_MENTAL_HEALTH_STREAK_THRESHOLD
): boolean {
  let consecutiveSadCount = 0;
  return moodDates.some((day) => {
    consecutiveSadCount = day.mood === "sad" ? consecutiveSadCount + 1 : 0;
    return consecutiveSadCount > threshold;
  });
}

function getPoorMentalStateCount(
  userMoodDatesArray: UserMoodDate[][],
  threshold: number = POOR_MENTAL_HEALTH_STREAK_THRESHOLD
): number {
  return userMoodDatesArray.filter((moodDates) => {
    hasPoorMentalState(moodDates, threshold);
  }).length;
}

function isUnresponsive(userMoodDates: UserMoodDate[]): boolean {
  return userMoodDates
    .map((userMoodDate) => userMoodDate.mood)
    .every((mood) => mood === undefined);
}

function getUnresponsiveCount(allUserMoodDates: UserMoodDate[][]): number {
  let unresponsiveCount = 0;

  for (const userMoodDates of allUserMoodDates) {
    if (isUnresponsive(userMoodDates)) {
      unresponsiveCount += 1;
    }
  }
  return unresponsiveCount;
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

const TableMoodRowDisplay = (props: { user: DashboardResponse }) => {
  const today = new Date();

  return (
    <Tr>
      <Td p={0}>
        <Flex>
          <Box width="12px" bg={getColorTag(props.user)} />
          <Box p={3} width="100%">
            <Text>{props.user.username}</Text>
          </Box>
        </Flex>
      </Td>
      {getLastFourDaysMood(props.user).map((lastFourDaysMood) => {
        return (
          <Td>
            <Box display="flex" justifyContent="center">
              <TableUserMoodCellDisplay
                mood={lastFourDaysMood.mood}
                isToday={
                  lastFourDaysMood.date.toDateString() === today.toDateString()
                }
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
            <Card borderLeft="12px solid" borderLeftColor={ColorTag.BAD}>
              <Box my="12px" mx="8px">
                <Heading size="md">
                  {getPoorMentalStateCount(
                    dashboardData.map((userMoodDate) =>
                      getLastFourDaysMood(userMoodDate)
                    )
                  )}
                </Heading>
                <Text fontSize="12px">In poor mental state</Text>
              </Box>
            </Card>
            <Card
              borderLeft="12px solid"
              borderLeftColor={ColorTag.UNRESPONSIVE}
            >
              <Box my="12px" mx="8px">
                <Heading size="md">
                  {getUnresponsiveCount(
                    dashboardData.map((userMoodDate) =>
                      getLastFourDaysMood(userMoodDate)
                    )
                  )}
                </Heading>
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
