import { Button } from "@opengovsg/design-system-react";

function MoodBtn(props: { content: string; onClick: any }) {
  return (
    <Button width="100%" height="100%" onClick={props.onClick}>
      {props.content}
    </Button>
  );
}

export default MoodBtn;
