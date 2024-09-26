import { Text } from "@chakra-ui/react";
import "./MoodMessage.css"; // We'll create a CSS file for 3D styles

function MoodMessage(props: {
  bg: string;
  bgLinearGradient: string;
  message: string;
}) {
  return (
    <button className="pushable">
      <span className="shadow"></span>
      <span
        className="edge"
        style={{
          background: props.bgLinearGradient,
        }}
      ></span>
      <span className="front" style={{ background: props.bg }}>
        <Text fontWeight="600" fontSize="42px">
          {props.message}
        </Text>
      </span>
    </button>
  );
}

export default MoodMessage;
