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
import type { CareReceipientDetailOut } from "@/api/types";
import { IconMood } from "@/components/IconMood";
import { getMoodTimeline } from "@/utils/moodTimeline";

const TableMoodSnapshotRow = (props: {
  colorTag: string;
  careReceipientId: number;
  user: CareReceipientDetailOut;
  handleCareReceipientClick: (careReceipientId: number) => void;
}) => {
  const timeline = getMoodTimeline(props.user.moods, 4, props.user.created_at);

  return (
    <Tr>
      <Td p={0}>
        <Flex>
          <Box width="12px" bg={props.colorTag} />
          <Box p={3} width="100%">
            <Text onClick={() => props.handleCareReceipientClick(props.careReceipientId)}>
              {props.user.name}
            </Text>
          </Box>
        </Flex>
      </Td>
      {timeline.map((day) => {
        return (
          <Td key={day.date.getTime()}>
            <Box display="flex" justifyContent="center">
              <IconMood mood={day.mood} isToday={day.isToday} />
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
                key={user.care_receipient_id}
                colorTag={props.getColorTag(user)}
                user={user}
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
