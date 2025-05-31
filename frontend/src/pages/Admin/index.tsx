import {
  Box,
  Card,
  Fade,
  Grid,
  Heading,
  Image,
  Link,
  Text,
} from "@chakra-ui/react";
import { Button } from "@opengovsg/design-system-react";
import { useNavigate } from "react-router-dom";
import {
  DashboardResponse,
  Mood,
  useGetAdminDashboardResponse,
} from "../../api/user";

import { TableMoodSnapshot } from "../../components/TableMoodSnapshot";

enum ColorTag {
  BAD = "#FF3B30",
  UNRESPONSIVE = "#AF52DE",
  EMPTY_STATE = "#30B0C7",
  GOOD = "#34C759",
}

function getColorTag(user: DashboardResponse): ColorTag {
  if (hasPoorMentalState(user.moods.slice(0, 4))) {
    return ColorTag.BAD;
  }
  if (isUnresponsive(user.moods.slice(0, 4))) {
    return ColorTag.UNRESPONSIVE;
  }
  return ColorTag.GOOD;
}

function hasPoorMentalState(moods: Mood[]): boolean {
  return moods.filter((mood) => mood.mood === "sad").length >= 2;
}

function getPoorMentalStateCount(users: DashboardResponse[]): number {
  return users.filter(
    (user) =>
      user.moods.slice(0, 4).filter((mood) => mood.mood === "sad").length >= 2
  ).length;
}

function isUnresponsive(userMoodDates: Mood[]): boolean {
  return userMoodDates
    .map((userMoodDate) => userMoodDate.mood)
    .every((mood) => mood === null);
}

function getUnresponsiveCount(users: DashboardResponse[]): number {
  return users.filter((user) => isUnresponsive(user.moods.slice(0, 4))).length;
}

function AdminDashboardSummaryCards(props: {
  dashboardData: DashboardResponse[];
}) {
  return (
    <Grid templateColumns="repeat(2, 1fr)" gap="12px">
      <Card borderLeft="12px solid" borderLeftColor={ColorTag.BAD}>
        <Box my="12px" mx="8px">
          <Heading size="md">
            {getPoorMentalStateCount(props.dashboardData)}
          </Heading>
          <Text fontSize="12px">In poor mental state</Text>
        </Box>
      </Card>
      <Card borderLeft="12px solid" borderLeftColor={ColorTag.UNRESPONSIVE}>
        <Box my="12px" mx="8px">
          <Heading size="md">
            {getUnresponsiveCount(props.dashboardData)}
          </Heading>
          <Text fontSize="12px">Unresponsive</Text>
        </Box>
      </Card>
    </Grid>
  );
}

function Admin() {
  const navigate = useNavigate();

  const { data, isLoading } = useGetAdminDashboardResponse();

  const handleUserClick = (userId: number) => {
    navigate(`/admin/${userId}`);
  };
  const handleAddAnotherPersonClick = () => {
    navigate(`/admin/create-user`);
  };

  if (!localStorage.getItem("token")) {
    navigate("/login");
    return;
  }
  if (isLoading || !data) {
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
          display="flex"
          flexDir="column"
          justifyContent="space-between"
          style={{ width: "100%", height: "100%" }}
          padding="18px"
        >
          <Box className="page" display="flex" flexDir="column" gap="24px">
            <Box display="flex" gap="8px" alignItems="center">
              <Image src="/assets/icon/heart.svg"></Image>
              <Heading size="sm" color="#007AFF">
                HeartBeat
              </Heading>
            </Box>
            <Box>
              <Heading size="sm">Persons I care for</Heading>
            </Box>

            <AdminDashboardSummaryCards dashboardData={data.data} />

            <TableMoodSnapshot
              dashboardData={data.data}
              getColorTag={getColorTag}
              handleUserClick={handleUserClick}
            />
            <Button size="xs" onClick={handleAddAnotherPersonClick}>
              Add another person
            </Button>
          </Box>
          <Box>
            <Text fontSize="12px">
              Enjoying this app? Check out&nbsp;
              <Link href="https://my.carecompass.sg/">CareCompass</Link>
            </Text>
          </Box>
        </Box>
      </Fade>
    </Box>
  );
}

export default Admin;
