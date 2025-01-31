import { Box } from "@chakra-ui/react";

const TREE_DISPLAYS = [
  "/assets/tree/seedling.gif",
  "/assets/tree/teen-tree.gif",
  "/assets/tree/adult-tree-with-flowers.svg",
  "/assets/tree/adult-tree-with-flowers-and-gifts.svg",
];

function Tree() {
  const treeDisplayUrl =
    TREE_DISPLAYS[Math.floor(Math.random() * TREE_DISPLAYS.length)];

  // PLACEHOLDER UNTIL ALL GIFS ARE AVAILABLE
  const isUsingGif = treeDisplayUrl.slice(-3) === "gif";

  return (
    <Box
      display="flex"
      width="100%"
      height="100%"
      backgroundImage={`url('${treeDisplayUrl}')`}
      backgroundSize="cover"
      backgroundRepeat="no-repeat"
      position="relative"
      backgroundPosition={isUsingGif ? "center" : ""}
      backgroundColor="transparent"
    />
  );
}

export default Tree;
