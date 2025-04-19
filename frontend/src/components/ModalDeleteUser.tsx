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

function ModalDeleteUser({
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
        <ModalHeader>Delete User</ModalHeader>
        <ModalBody>
          <Box>
            <Text>Are you sure you want to delete this user?</Text>
            <Text color="gray.500" fontSize="sm" mt={2}>
              This action cannot be undone.
            </Text>
          </Box>
        </ModalBody>
        <ModalFooter display="flex" justifyContent="flex-end" gap={3}>
          <Button onClick={onClose}>Cancel</Button>
          <Button colorScheme="red" onClick={onConfirm}>
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default ModalDeleteUser;
