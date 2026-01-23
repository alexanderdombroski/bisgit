import { Text } from 'ink';
import { useModal } from './useModal';
import { Modal } from './modal';
import { useTruncationMode } from '../hooks/useTruncationMode';

type ModalProps = {
  title: string;
  message: string | string[];
  width?: number;
};

export function Alert({ title, message, width }: ModalProps) {
  const { isOpen } = useModal();
  const { mode } = useTruncationMode();

  return (
    isOpen && (
      <Modal title={title} width={width}>
        {Array.isArray(message) ? (
          message.map((line) => <Text wrap={mode}>{line}</Text>)
        ) : (
          <Text>{message}</Text>
        )}
      </Modal>
    )
  );
}
