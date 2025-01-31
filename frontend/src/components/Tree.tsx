import { Box } from "@chakra-ui/react";
import { TreeDisplayState } from "../api/user";

const TREE_DISPLAY_STATE_TO_SVG_LINK = {
  [TreeDisplayState.SEEDLING]: "/assets/tree/seedling.gif",
  [TreeDisplayState.TEEN_TREE]: "/assets/tree/teen-tree.gif",
  [TreeDisplayState.ADULT_TREE]: "/assets/tree/adult-tree.svg",
  [TreeDisplayState.ADULT_TREE_WITH_FLOWERS]:
    "/assets/tree/adult-tree-with-flowers.svg",
  [TreeDisplayState.ADULT_TREE_WITH_FLOWERS_AND_GIFTS]:
    "/assets/tree/adult-tree-with-flowers-and-gifts.svg",
};

function Tree(props: {
  treeDisplayState: TreeDisplayState;
  onClaimGiftBtnClick: () => Promise<void>;
  coinCount: number;
}) {
  // PLACEHOLDER UNTIL ALL GIFS ARE AVAILABLE
  const isUsingGif =
    TREE_DISPLAY_STATE_TO_SVG_LINK[props.treeDisplayState].slice(-3) === "gif";

  return (
    <Box
      display="flex"
      width="100%"
      height="100%"
      backgroundImage={`url('${
        TREE_DISPLAY_STATE_TO_SVG_LINK[props.treeDisplayState]
      }')`}
      backgroundSize="cover"
      backgroundRepeat="no-repeat"
      position="relative"
      backgroundPosition={isUsingGif ? "center" : ""}
      backgroundColor="transparent"
    ></Box>
  );
}

export default Tree;
