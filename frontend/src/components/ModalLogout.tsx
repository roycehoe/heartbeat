import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";

function ModalLogOut({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Log out</ModalHeader>
        <ModalBody>
          <Box>
            <Text>Are you sure you want to log out?</Text>
          </Box>
        </ModalBody>
        <ModalFooter display="flex" justifyContent="flex-end" gap={3}>
          <Button onClick={onClose}>Cancel</Button>
          <Button colorScheme="red" onClick={onConfirm}>
            Log out
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default ModalLogOut;
