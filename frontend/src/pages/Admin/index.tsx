import {
  Box,
  Fade,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { Button } from "@opengovsg/design-system-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardResponse, getAdminDashboardResponse } from "../../api/user";

import { Table } from "@chakra-ui/react";

const Demo = () => {
  return (
    <TableContainer>
      <Table size="sm">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th colSpan={5} textAlign="center">
              Mood snapshot
            </Th>
          </Tr>
          <Tr>
            <Th py="1px"></Th>
            <Th py="1px" fontSize={8}>
              Today
            </Th>
            <Th py="1px" fontSize={8}>
              1d ago
            </Th>
            <Th py="1px" fontSize={8}>
              2d ago
            </Th>
            <Th py="1px" fontSize={8}>
              3d ago
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>Tony</Td>
            <Td>
              <Box display="flex" justifyContent="center">
                -
              </Box>
            </Td>
            <Td>
              <Box display="flex" justifyContent="center">
                <img src="/assets/icon/happy.svg" />
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
          gap="12px"
        >
          <Box display="flex" justifyContent="space-between">
            <Box bg="red.200">Heartbeat</Box>
            <Box bg="red">Cross</Box>
          </Box>
          <Box>
            <Text>Persons I care for</Text>
          </Box>
          <Box>Some Table</Box>
          <Demo></Demo>
          <Button size="xs">Add another person</Button>
        </Box>
      </Fade>
    </Box>
  );
}

export default Admin;
