import { Button } from "@opengovsg/design-system-react";
import React from "react";
import "./MoodBtn.css"; // We'll create a CSS file for 3D styles

function MoodBtn(props: {
  icon: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
  onClick: () => void;
  bg: string;
  bgLinearGradient: string;
  bgDisabled: string;
  bgDisabledLinearGradient: string;
  isDisabled: boolean;
}) {
  return (
    <button
      isDisabled={props.isDisabled}
      className="pushable"
      onClick={props.onClick}
      width="100%"
      height="100%"
    >
      <span className="shadow"></span>
      <span
        className="edge"
        style={{
          background: props.isDisabled
            ? props.bgDisabledLinearGradient
            : props.bgLinearGradient,
        }}
      ></span>
      <span
        className="front"
        style={{ background: props.isDisabled ? props.bgDisabled : props.bg }}
      >
        {props.icon}
      </span>
    </button>
  );
}

export default MoodBtn;
