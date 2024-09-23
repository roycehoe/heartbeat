import { Button } from "@opengovsg/design-system-react";

function MoodBtn(props: {
  icon: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
  onClick: any;
}) {
  return (
    <Button
      leftIcon={props.icon}
      // width="100%"
      height="100%"
      onClick={props.onClick}
    ></Button>
  );
}

export default MoodBtn;
