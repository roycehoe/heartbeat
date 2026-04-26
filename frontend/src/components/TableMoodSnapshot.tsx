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
import { CareReceipientDetailMoodOut, CareReceipientDetailOut } from "../api/types";
import { IconMood } from "./IconMood";

const TableMoodSnapshotRow = (props: {
  colorTag: string;
  name: string;
  careReceipientId: number;
  moods: CareReceipientDetailMoodOut[];
  handleCareReceipientClick: (careReceipientId: number) => void;
}) => {
  const today = new Date();

  return (
    <Tr>
      <Td p={0}>
        <Flex>
          <Box width="12px" bg={props.colorTag} />
          <Box p={3} width="100%">
            <Text onClick={() => props.handleCareReceipientClick(props.careReceipientId)}>
              {props.name}
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
  dashboardData: CareReceipientDetailOut[];
  getColorTag: (user: CareReceipientDetailOut) => string;
  handleCareReceipientClick: (careReceipientId: number) => void;
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
                name={user.name}
                moods={user.moods}
                careReceipientId={user.care_receipient_id}
                handleCareReceipientClick={props.handleCareReceipientClick}
              />
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
