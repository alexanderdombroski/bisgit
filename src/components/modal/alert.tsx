import { Text } from 'ink';
import { useModal } from './useModal';
import { Modal } from './modal';

type ModalProps = {
  title: string;
  message: string;
};

// eslint-disable-next-line no-unused-vars
function Alert({ title, message }: ModalProps) {
  const { isOpen } = useModal();

  return (
    isOpen && (
      <Modal title={title}>
        <Text>{message}</Text>
      </Modal>
    )
  );
}
