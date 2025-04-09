import {
  Box,
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { DashboardResponse, MoodValue } from "../api/user";
import { UserMoodDate } from "../pages/Admin/utils";

const TableMoodSnapshotCellMoodIcon = (props: {
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

const TableMoodSnapshotRow = (props: {
  colorTag: string;
  username: string;
  lastFourDaysMoods: UserMoodDate[];
}) => {
  const today = new Date();

  return (
    <Tr>
      <Td p={0}>
        <Flex>
          <Box width="12px" bg={props.colorTag} />
          <Box p={3} width="100%">
            <Text>{props.username}</Text>
          </Box>
        </Flex>
      </Td>
      {props.lastFourDaysMoods.map((lastFourDaysMood) => {
        return (
          <Td>
            <Box display="flex" justifyContent="center">
              <TableMoodSnapshotCellMoodIcon
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

export const TableMoodSnapshot = (props: {
  dashboardData: DashboardResponse[];
  getColorTag: (user: DashboardResponse) => string;
  getLastFourDaysMood: (user: DashboardResponse) => UserMoodDate[];
}) => {
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
            return (
              <TableMoodSnapshotRow
                colorTag={props.getColorTag(user)}
                username={user.username}
                lastFourDaysMoods={props.getLastFourDaysMood(user)}
              />
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
