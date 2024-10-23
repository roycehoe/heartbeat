import "./MoodBtn.css"; // We'll create a CSS file for 3D styles

function MoodBtn(props: {
  icon: string;
  onClick: () => void;
  bg: string;
  bgLinearGradient: string;

  isDisabledIcon: string;
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
        style={{
          background: props.isDisabled ? props.bgDisabled : props.bg,
          maxWidth: "100%",
          maxHeight: "100%",
          objectFit: "contain",
        }}
      >
        <img
          src={props.isDisabled ? props.isDisabledIcon : props.icon}
          style={{
            background: props.isDisabled ? props.bgDisabled : props.bg,
            height: "60px",
            objectFit: "contain",
          }}
        ></img>
      </span>
    </button>
  );
}

export default MoodBtn;
