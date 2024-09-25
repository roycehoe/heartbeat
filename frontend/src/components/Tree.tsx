import { Box } from "@chakra-ui/react";
import { Button } from "@opengovsg/design-system-react";
import { useState } from "react";
import { TreeDisplayState } from "../api/user";
import Coins from "./Coins";

const TREE_DISPLAY_STATE_TO_SVG_LINK = {
  [TreeDisplayState.SEEDLING]: "/src/assets/tree/seedling.svg",
  [TreeDisplayState.TEEN_TREE]: "/src/assets/tree/teen-tree.svg",
  [TreeDisplayState.ADULT_TREE]: "/src/assets/tree/adult-tree.svg",
  [TreeDisplayState.ADULT_TREE_WITH_FLOWERS]:
    "/src/assets/tree/adult-tree-with-flowers.svg",
  [TreeDisplayState.ADULT_TREE_WITH_FLOWERS_AND_GIFTS]:
    "/src/assets/tree/adult-tree-with-flowers-and-gifts.svg",
};

function Gifts(props: {
  claimableGifts: number;
  onClaimGiftsBtnClick: () => Promise<void>;
}) {
  const [gifts, setGifts] = useState({
    leftFlower: props.claimableGifts > 0,
    topFlower: props.claimableGifts > 1,
    rightFlower: props.claimableGifts > 2,
  });

  const handleGiftClick = (
    flower: "leftFlower" | "topFlower" | "rightFlower"
  ) => {
    props.onClaimGiftsBtnClick();
    setGifts((prev) => ({ ...prev, [flower]: false }));
  };

  return (
    <div>
      <div>
        {gifts.leftFlower && (
          <button
            style={{
              position: "absolute",
              top: "20%",
              left: "30%",
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
              top: "0%",
              left: "50%",
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
              top: "40%",
              left: "70%",
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
  onClaimGiftBtnClick: () => Promise<void>;
  coinCount: number;
}) {
  const isShowGifts =
    props.treeDisplayState ===
    TreeDisplayState.ADULT_TREE_WITH_FLOWERS_AND_GIFTS;
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
    >
      <Coins coinCount={props.coinCount}></Coins>
      <Gifts
        claimableGifts={props.claimableGifts}
        onClaimGiftsBtnClick={props.onClaimGiftBtnClick}
      ></Gifts>
      {/* {isShowGifts ? (
        <Gifts
          claimableGifts={props.claimableGifts}
          onClaimGiftsBtnClick={props.onClaimGiftBtnClick}
        ></Gifts>
      ) : (
        ""
      )} */}
    </Box>
  );
}

export default Tree;
