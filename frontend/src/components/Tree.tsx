import { Box } from "@chakra-ui/react";
import { useState } from "react";
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

function Gifts(props: { claimableGifts: number }) {
  const [gifts, setGifts] = useState({
    leftFlower: props.claimableGifts > 0,
    topFlower: props.claimableGifts > 1,
    rightFlower: props.claimableGifts > 2,
  });

  const handleGiftClick = (
    flower: "leftFlower" | "topFlower" | "rightFlower"
  ) => {
    setGifts((prev) => ({ ...prev, [flower]: false }));
  };

  return (
    <div>
      <div>
        {gifts.leftFlower && (
          <button
            style={{
              position: "absolute",
              left: "600px",
              top: "100px",
            }}
            onClick={() => handleGiftClick("leftFlower")}
          >
            <img src={"/src/assets/gift.svg"} className="left-flower"></img>
          </button>
        )}

        {gifts.topFlower && (
          <button
            style={{
              position: "absolute",
              top: "200px",
              left: "400px",
            }}
            onClick={() => handleGiftClick("topFlower")}
          >
            <img src={"/src/assets/gift.svg"} className="top-flower"></img>
          </button>
        )}

        {gifts.rightFlower && (
          <button
            style={{
              position: "absolute",
              top: "300px",
              left: "800px",
            }}
            onClick={() => handleGiftClick("rightFlower")}
          >
            <img className="right-flower" src={"/src/assets/gift.svg"}></img>
          </button>
        )}
      </div>
    </div>
  );
}

function Tree(props: {
  treeDisplayState: TreeDisplayState;
  claimableGifts: number;
}) {
  const isShowGifts =
    props.treeDisplayState ===
    TreeDisplayState.ADULT_TREE_WITH_FLOWERS_AND_GIFTS;

  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="flex-end"
      alignItems="center"
      gap={1}
      width="100%"
      height="100%"
      maxHeight="500px"
    >
      <div style={{ position: "relative", display: "inline-block" }}></div>
      <img
        style={{ height: "100%" }}
        src={TREE_DISPLAY_STATE_TO_SVG_LINK[props.treeDisplayState]}
      ></img>
      {isShowGifts ? <Gifts claimableGifts={props.claimableGifts}></Gifts> : ""}
    </Box>
  );
}

export default Tree;
