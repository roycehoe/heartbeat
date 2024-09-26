import { Box } from "@chakra-ui/react";
import { DashboardResponse } from "../../../api/user";
import Brand from "../../../components/Brand";
import CalendarDateRange from "../../../components/CalendarDateRange";
import Tree from "../../../components/Tree";

function Display(props: {
  dashboardData: DashboardResponse;
  goToNextUser: () => void;
  onClaimGiftBtnClick: () => Promise<void>;
}) {
  return (
    <Box
      display="flex"
      className="dashboard--top"
      height="100%"
      width="100%"
      paddingRight="20px"
      paddingLeft="52px"
    >
      <Box
        className="dashboard--top--left"
        width="70%"
        height="100%"
        display="flex"
      >
        <Tree
          treeDisplayState={props.dashboardData.tree_display_state}
          claimableGifts={props.dashboardData.claimable_gifts}
          onClaimGiftBtnClick={props.onClaimGiftBtnClick}
          coinCount={props.dashboardData.coins}
        ></Tree>
      </Box>
      <Box
        className="dashboard--top--right"
        display="flex"
        flexDirection="column"
        justifyContent="space-evenly"
        width="30%"
        gap="56px"
        marginRight="36px"
      >
        <Box
          className="dashboard--top--right--brand"
          display="flex"
          justifyContent="flex-end"
        >
          <Brand goToNextUser={props.goToNextUser}></Brand>
        </Box>
        <Box
          className="dashboard--top--right--date-range"
          display="flex"
          justifyContent="flex-end"
          width="100%"
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
