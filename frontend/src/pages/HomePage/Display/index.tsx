import { Box } from "@chakra-ui/react";
import { DashboardResponse } from "../../../api/user";
import Brand from "../../../components/Brand";
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
          <Brand goToNextUser={props.goToNextUser}></Brand>
        </Box>
        <Box className="dashboard--top--tree" height="100%" width="100%">
          <Tree
            treeDisplayState={props.dashboardData.tree_display_state}
            onClaimGiftBtnClick={props.onClaimGiftBtnClick}
          ></Tree>
        </Box>
      </Box>
    </Box>
  );
}

export default Display;
