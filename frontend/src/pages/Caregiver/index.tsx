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
import { useGetCaregiverDashboardResponse } from "@/api/getCaregiverDashboardResponse";
import { CareReceipientDetailMoodOut, CareReceipientDetailOut } from "@/api/types";

import { useEffect } from "react";
import { TableMoodSnapshot } from "@/components/TableMoodSnapshot";

enum ColorTag {
  BAD = "#FF3B30",
  UNRESPONSIVE = "#AF52DE",
  EMPTY_STATE = "#30B0C7",
  GOOD = "#34C759",
}

function getColorTag(user: CareReceipientDetailOut): ColorTag {
  if (hasPoorMentalState(user.moods.slice(0, 4))) {
    return ColorTag.BAD;
  }
  if (isUnresponsive(user.moods.slice(0, 4))) {
    return ColorTag.UNRESPONSIVE;
  }
  return ColorTag.GOOD;
}

function hasPoorMentalState(moods: CareReceipientDetailMoodOut[]): boolean {
  return moods.filter((mood) => mood.mood === "sad").length >= 2;
}

function getPoorMentalStateCount(users: CareReceipientDetailOut[]): number {
  return users.filter(
    (user) =>
      user.moods.slice(0, 4).filter((mood) => mood.mood === "sad").length >= 2
  ).length;
}

function isUnresponsive(userMoodDates: CareReceipientDetailMoodOut[]): boolean {
  return userMoodDates
    .map((userMoodDate) => userMoodDate.mood)
    .every((mood) => mood === null);
}

function getUnresponsiveCount(users: CareReceipientDetailOut[]): number {
  return users.filter((user) => isUnresponsive(user.moods.slice(0, 4))).length;
}

function CaregiverDashboardSummaryCards(props: {
  dashboardData: CareReceipientDetailOut[];
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

function Caregiver() {
  const navigate = useNavigate();

  const { data, isLoading } = useGetCaregiverDashboardResponse();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }
  }, [data]);

  const handleCareReceipientClick = (careReceipientId: number) => {
    navigate(`/dashboard/care-receipient/${careReceipientId}`);
  };
  const handleAddAnotherPersonClick = () => {
    navigate(`/dashboard/create-care-receipient`);
  };
  const handleGearIconClick = () => {
    navigate(`/dashboard/settings`);
  };

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
            <Box display="flex" gap="8px" justifyContent="space-between">
              <Box display="flex" gap="8px" alignItems="center">
                <Image src="/assets/icon/heart.svg"></Image>
                <Heading size="sm" color="#007AFF">
                  HeartBeat
                </Heading>
              </Box>
              <Box onClick={handleGearIconClick}>
                <img src="/assets/icon/gear.svg" />
              </Box>
            </Box>
            <Box>
              <Heading size="sm">Persons I care for</Heading>
            </Box>

            <CaregiverDashboardSummaryCards dashboardData={data.data} />

            <TableMoodSnapshot
              dashboardData={data.data}
              getColorTag={getColorTag}
              handleCareReceipientClick={handleCareReceipientClick}
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

export default Caregiver;
