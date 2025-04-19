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

function ModalResetUserPassword({
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
        <ModalHeader>Reset user password</ModalHeader>
        <ModalBody>
          <Box>
            <Text>Are you sure you want to reset this user's password?</Text>
            <Text color="gray.500" fontSize="sm" mt={2}>
              This action cannot be undone.
            </Text>
          </Box>
        </ModalBody>
        <ModalFooter display="flex" justifyContent="flex-end" gap={3}>
          <Button onClick={onClose}>Cancel</Button>
          <Button colorScheme="red" onClick={onConfirm}>
            Reset Password
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default ModalResetUserPassword;
