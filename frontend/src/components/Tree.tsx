import { Box } from "@chakra-ui/react";
import { TreeDisplayState } from "../api/dashboard";

const TREE_DISPLAY_STATE_TO_SVG_LINK = {
  [TreeDisplayState.SEEDLING]: "/src/assets/tree/seedling.svg",
  [TreeDisplayState.TEEN_TREE]: "/src/assets/tree/teen-tree.svg",
  [TreeDisplayState.ADULT_TREE]: "/src/assets/tree/adult-tree.svg",
  [TreeDisplayState.ADULT_TREE_WITH_FLOWERS]:
    "/src/assets/tree/adult-tree-with-flowers.svg",
  [TreeDisplayState.ADULT_TREE_WITH_FLOWERS_AND_GIFTS]:
    "/src/assets/tree/adult-tree-with-flowers-and-gifts.svg",
};

function Tree(props: { treeDisplayState: TreeDisplayState }) {
  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="flex-end"
      alignItems="center"
      gap={1}
      width="100%"
      height="100%"
    >
      <img
        style={{ height: "100%" }}
        src={TREE_DISPLAY_STATE_TO_SVG_LINK[props.treeDisplayState]}
      ></img>
    </Box>
  );
}

export default Tree;
