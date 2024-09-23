import { Box, Text } from "@chakra-ui/react";
import { TreeDisplayState } from "../api/dashboard";

// export enum TreeDisplayState {
//   SEEDLING = 1,
//   TEEN_TREE = 2,
//   ADULT_TREE = 3,
//   ADULT_TREE_WITH_FLOWERS = 4,
//   ADULT_TREE_WITH_FLOWERS_AND_GIFTS = 5,
// }

const TREE_DISPLAY_STATE_TO_SVG_LINK = {
  [TreeDisplayState.SEEDLING]: "/src/assets/tree/seedling.svg",
  [TreeDisplayState.TEEN_TREE]: "/src/assets/tree/teen-tree.svg",
  [TreeDisplayState.ADULT_TREE]: "/src/assets/tree/adult-tree.svg",
  [TreeDisplayState.ADULT_TREE_WITH_FLOWERS]:
    "/src/assets/tree/ADULT_TREE_WITH_FLOWERS",
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
    >
      <img src={TREE_DISPLAY_STATE_TO_SVG_LINK[props.treeDisplayState]}></img>
    </Box>
  );
}

export default Tree;
