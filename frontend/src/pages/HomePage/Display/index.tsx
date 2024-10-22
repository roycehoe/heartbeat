import { Box } from "@chakra-ui/react";
import { DashboardResponse } from "../../../api/user";
import Brand from "../../../components/Brand";
import Coins from "../../../components/Coins";
import Tree from "../../../components/Tree";

function Display(props: {
  dashboardData: DashboardResponse;
  goToNextUser: () => void;
  onClaimGiftBtnClick: () => Promise<void>;
}) {
  return (
    <Box display="flex" className="dashboard--top" height="100%" width="100%">
      <Box
        className="dashboard--top--left"
        width="100%"
        height="100%"
        display="flex"
        justifyItems="center"
        flexDirection="column"
      >
        <Box
          className="dashboard--top--info"
          display="flex"
          justifyContent="space-between"
          margin="12px"
        >
          <Coins coinCount={props.dashboardData.coins}></Coins>
          <Brand goToNextUser={props.goToNextUser}></Brand>
        </Box>
        <Box className="dashboard--top--tree" height="100%" width="100%">
          <Tree
            treeDisplayState={props.dashboardData.tree_display_state}
            claimableGifts={props.dashboardData.claimable_gifts}
            onClaimGiftBtnClick={props.onClaimGiftBtnClick}
            coinCount={props.dashboardData.coins}
          ></Tree>
        </Box>
      </Box>
    </Box>
  );
}

export default Display;
