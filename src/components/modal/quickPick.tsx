import { useInput } from 'ink';
import { useModal } from './useModal';
import SelectInput from 'ink-select-input';
import { Modal } from './modal';

type Option<V, L extends string = string> = { value: V; label: L };

type ModalProps<V, L extends string = string> = {
  title: string;
  options: Readonly<Option<V, L>[]>;
  handleSubmit: (option: Option<V, L>) => void;
  initialIndex: number;
};

export function QuickPick<V, L extends string = string>({
  title,
  handleSubmit,
  options,
  initialIndex,
}: ModalProps<V, L>) {
  const { isOpen, close } = useModal();

  useInput((input, key) => {
    if (key.return) {
      if (isOpen) {
        close();
      }
    }
  });

  return (
    isOpen && (
      <Modal title={title}>
        <SelectInput
          // Casting is neccessary due to generic typing limiartions of library
          items={options as Option<V, L>[]}
          onSelect={handleSubmit as (item: Option<V>) => void}
          initialIndex={initialIndex}
        />
      </Modal>
    )
  );
}
