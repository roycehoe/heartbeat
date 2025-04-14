import { Box, Card, Fade, Grid, Heading, Image, Text } from "@chakra-ui/react";
import { Button } from "@opengovsg/design-system-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardResponse, getAdminDashboardResponse } from "../../api/user";

import { TableMoodSnapshot } from "../../components/TableMoodSnapshot";
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

function AdminDashboardSummaryCards(props: {
  dashboardData: DashboardResponse[];
}) {
  return (
    <Grid templateColumns="repeat(2, 1fr)" gap="12px">
      <Card borderLeft="12px solid" borderLeftColor={ColorTag.BAD}>
        <Box my="12px" mx="8px">
          <Heading size="md">
            {getPoorMentalStateCount(
              props.dashboardData.map((userMoodDate) =>
                getLastFourDaysMood(userMoodDate)
              )
            )}
          </Heading>
          <Text fontSize="12px">In poor mental state</Text>
        </Box>
      </Card>
      <Card borderLeft="12px solid" borderLeftColor={ColorTag.UNRESPONSIVE}>
        <Box my="12px" mx="8px">
          <Heading size="md">
            {getUnresponsiveCount(
              props.dashboardData.map((userMoodDate) =>
                getLastFourDaysMood(userMoodDate)
              )
            )}
          </Heading>
          <Text fontSize="12px">Unresponsive</Text>
        </Box>
      </Card>
    </Grid>
  );
}

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
  const handleUserClick = (userName: string) => {
    navigate(`/admin/${userName}`);
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

          <AdminDashboardSummaryCards dashboardData={dashboardData} />

          <TableMoodSnapshot
            dashboardData={dashboardData}
            getColorTag={getColorTag}
            handleUserClick={handleUserClick}
          />
          <Button size="xs">Add another person</Button>
        </Box>
      </Fade>
    </Box>
  );
}

export default Admin;
