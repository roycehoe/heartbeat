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
// const _DashboardTable = () => {
//   return (
//     <TableContainer>
//       <Table size="sm" variant="simple">
//         <Thead>
//           <Tr>
//             <Th textTransform="none">Name</Th>
//             <Th textTransform="none" colSpan={5} textAlign="center">
//               Mood snapshot
//             </Th>
//           </Tr>
//           <Tr>
//             <Th textTransform="none" py="1px"></Th>
//             <Th textTransform="none" py="1px" fontSize={8}>
//               Today
//             </Th>
//             <Th textTransform="none" py="1px" fontSize={8}>
//               1d ago
//             </Th>
//             <Th textTransform="none" py="1px" fontSize={8}>
//               2d ago
//             </Th>
//             <Th textTransform="none" py="1px" fontSize={8}>
//               3d ago
//             </Th>
//           </Tr>
//         </Thead>
//         <Tbody>
//           <Tr>
//             <Td p={0}>
//               <Flex>
//                 <Box width="12px" bg={COLOR_TAG.UNRESPONSIVE} />
//                 <Box p={3} width="100%">
//                   <Text>Tony</Text>
//                 </Box>
//               </Flex>
//             </Td>

//             <Td>
//               <Box display="flex" justifyContent="center">
//                 -
//               </Box>
//             </Td>
//             <Td>
//               <Box display="flex" justifyContent="center">
//                 <img src="/assets/icon/happy.svg" />
//               </Box>
//             </Td>
//             <Td>
//               <Box display="flex" justifyContent="center">
//                 <img src="/assets/icon/ok.svg" />
//               </Box>
//             </Td>
//             <Td>
//               <Box display="flex" justifyContent="center">
//                 <img src="/assets/icon/sad.svg" />
//               </Box>
//             </Td>
//           </Tr>
//         </Tbody>
//       </Table>
//     </TableContainer>
//   );
// };

enum TableUserMoodDisplayState {
  DASH,
  CROSS,
  HAPPY,
  OK,
  SAD,
}

function isSameDay(firstDate: Date, secondDate: Date) {
  return (
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate()
  );
}

// function getTableUserMoodDisplayState(
//   mood: Mood,
//   dateOfColumn: Date
// ): TableUserMoodDisplayState {
//   if (dateOfColumn.getDate()) {
//     return TableUserMoodDisplayState.DASH;
//   }
//   return TableUserMoodDisplayState.DASH;
// }

// const TableUserMoodCellDisplay = (props: { mood: Mood }) => {
//   if (props.mood.mood === MoodValue.HAPPY) {
//     return (
//       <Box display="flex" justifyContent="center">
//         <img src="/assets/icon/happy.svg" />
//       </Box>
//     );
//   }
//   if (props.mood.mood === MoodValue.OK) {
//     return (
//       <Box display="flex" justifyContent="center">
//         <img src="/assets/icon/ok.svg" />
//       </Box>
//     );
//   }
//   if (props.mood.mood === MoodValue.SAD) {
//     return (
//       <Box display="flex" justifyContent="center">
//         <img src="/assets/icon/sad.svg" />
//       </Box>
//     );
//   }
//   return (
//     <Box display="flex" justifyContent="center">
//       -
//     </Box>
//   );
// };

function getDayBefore(daysBefore: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - daysBefore);
  return date;
}

const TableMoodRowDisplay = (props: { user: DashboardResponse }) => {
  const today = getDayBefore(0);
  const yesterday = getDayBefore(1);
  const dayBeforeYesterday = getDayBefore(2);

  return (
    <div>
      <Tr>
        <Td p={0}>
          <Flex>
            <Box width="12px" bg={COLOR_TAG.UNRESPONSIVE} />
            <Box p={3} width="100%">
              <Text>{props.user.username}</Text>
            </Box>
          </Flex>
        </Td>

        <Td>
          {/* <Box display="flex" justifyContent="center">
            -
          </Box> */}
          <Box display="flex" justifyContent="center">
            {Date.parse(props.user.moods[0].created_at)}
            {String(today)}
          </Box>
        </Td>
        <Td>
          <Box display="flex" justifyContent="center">
            {/* <img src="/assets/icon/happy.svg" /> */}
            {/* {yesterday} */}
          </Box>
        </Td>
        <Td>
          <Box display="flex" justifyContent="center">
            <img src="/assets/icon/ok.svg" />
          </Box>
        </Td>
        <Td>
          <Box display="flex" justifyContent="center">
            <img src="/assets/icon/sad.svg" />
          </Box>
        </Td>
      </Tr>
    </div>
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
            return <TableMoodRowDisplay user={user}></TableMoodRowDisplay>;
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
