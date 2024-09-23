import { Box } from "@chakra-ui/react";
import { DashboardResponse } from "../../../api/dashboard";
import Coins from "../../../components/Coins";

function Display(props: { dashboardData: DashboardResponse }) {
  return (
    <Box display="flex" bg="green.400" className="dashboard--top" height="100%">
      <Box
        bg="yellow.400"
        className="dashboard--top--left"
        width="50%"
        display="flex"
        gap="42px"
      >
        <Box bg="skin.2base" className="dashboard--top--left">
          <Coins coinCount={props.dashboardData.coins}></Coins>
        </Box>
        <Box bg="skin.2base" className="dashboard--top--left">
          <p>Tree!</p>
        </Box>
      </Box>
      <Box
        bg="red.400"
        className="dashboard--top--right"
        display="flex"
        flexDirection="column"
        width="50%"
        gap="56px"
      >
        <Box
          bg="slate.200"
          className="dashboard--top--left"
          display="flex"
          justifyContent="flex-end"
        >
          <p>logo</p>
        </Box>
        <Box
          bg="slate.200"
          className="dashboard--top--left"
          display="flex"
          justifyContent="flex-end"
        >
          <p>calendar</p>
        </Box>
      </Box>
    </Box>
  );
}

export default Display;
