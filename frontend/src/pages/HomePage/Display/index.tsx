import { Box } from "@chakra-ui/react";
import { DashboardResponse } from "../../../api/dashboard";
import Brand from "../../../components/Brand";
import CalendarDateRange from "../../../components/CalendarDateRange";
import Coins from "../../../components/Coins";
import Tree from "../../../components/Tree";

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
        <Box bg="skin.2base" className="dashboard--top--left" minWidth="96px">
          <Coins coinCount={props.dashboardData.coins}></Coins>
        </Box>
        <Box
          bg="skin.2base"
          className="dashboard--top--left"
          width="100%"
          height="100%"
        >
          <Tree
            treeDisplayState={props.dashboardData.tree_display_state}
          ></Tree>
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
          className="dashboard--top--right--brand"
          display="flex"
          justifyContent="flex-end"
        >
          <Brand></Brand>
        </Box>
        <Box
          bg="slate.200"
          className="dashboard--top--right--date-range"
          display="flex"
          justifyContent="flex-end"
          width="100%"
          height="100%"
        >
          <CalendarDateRange
            dateRange={props.dashboardData.moods.map((mood) => {
              return mood.created_at;
            })}
          ></CalendarDateRange>
        </Box>
      </Box>
    </Box>
  );
}

export default Display;
