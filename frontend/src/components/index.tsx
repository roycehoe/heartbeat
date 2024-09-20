import { Button } from "@opengovsg/design-system-react";

function MoodBtn(props: { content: string }) {
  return (
    <Button width="100%" height="100%">
      {props.content}
    </Button>
  );
}

export default MoodBtn;
