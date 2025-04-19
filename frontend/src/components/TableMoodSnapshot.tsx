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
import { DashboardResponse, Mood } from "../api/user";
import { IconMood } from "./IconMood";

const TableMoodSnapshotRow = (props: {
  colorTag: string;
  username: string;
  userId: number;
  moods: Mood[];
  handleUserClick: (userId: number) => void;
}) => {
  const today = new Date();

  return (
    <Tr>
      <Td p={0}>
        <Flex>
          <Box width="12px" bg={props.colorTag} />
          <Box p={3} width="100%">
            <Text onClick={() => props.handleUserClick(props.userId)}>
              {props.username}
            </Text>
          </Box>
        </Flex>
      </Td>
      {props.moods.slice(0, 4).map((mood) => {
        return (
          <Td>
            <Box display="flex" justifyContent="center">
              <IconMood
                mood={mood.mood}
                isToday={
                  new Date(mood.created_at).toDateString() ===
                  today.toDateString()
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
  handleUserClick: (userId: number) => void;
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
                moods={user.moods}
                userId={user.user_id}
                handleUserClick={props.handleUserClick}
              />
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
