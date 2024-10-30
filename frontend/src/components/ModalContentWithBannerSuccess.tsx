import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@chakra-ui/react";
import { Banner } from "@opengovsg/design-system-react";

function ModalContentWithBannerSuccess(props: {
  header: string;
  banner: string;
}) {
  return (
    <ModalContent>
      <ModalHeader>{props.header}</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Banner>{props.banner}</Banner>
      </ModalBody>
      <ModalFooter></ModalFooter>
    </ModalContent>
  );
}

export default ModalContentWithBannerSuccess