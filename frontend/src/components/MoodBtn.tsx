import React from "react";
import "./MoodBtn.css"; // We'll create a CSS file for 3D styles

function MoodBtn(props: {
  icon: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
  onClick: () => void;
  bg: string;
  bgLinearGradient: string;

  isDisabledIcon: React.ReactElement<
    any,
    string | React.JSXElementConstructor<any>
  >;
  bgDisabled: string;
  bgDisabledLinearGradient: string;
  isDisabled: boolean;
}) {
  return (
    <button
      disabled={props.isDisabled}
      className="pushable"
      onClick={props.onClick}
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
        {props.isDisabled ? props.icon : props.isDisabledIcon}
      </span>
    </button>
  );
}

export default MoodBtn;
