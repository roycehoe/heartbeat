import React from "react";
import "./MoodBtn.css"; // We'll create a CSS file for 3D styles

function MoodBtn(props: {
  icon: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
  onClick: () => void;
  bg: string;
  bgLinearGradient: string;
}) {
  return (
    <button className="pushable" onClick={props.onClick}>
      <span className="shadow"></span>
      <span
        className="edge"
        style={{ background: props.bgLinearGradient }}
      ></span>
      <span className="front" style={{ background: props.bg }}>
        {props.icon}
      </span>
    </button>
  );
}

export default MoodBtn;
