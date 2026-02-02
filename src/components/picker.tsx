import { Box, Text, useApp, useInput } from 'ink';
import SelectInput from 'ink-select-input';

export type Item<T> = { value: T; label: string };
type PickerProps<T> = {
  items: Item<T>[];
  prompt: string;
  onSelect: (item: Item<T>) => Promise<void>;
};

export function Picker<T>({ prompt, onSelect, items }: PickerProps<T>) {
  const { exit } = useApp();

  useInput((input, key) => {
    if (key.escape) {
      exit();
    }
  });

  const runOnSelect = async (item: Item<T>) => {
    await onSelect(item);
    exit();
  };

  return (
    <Box flexDirection="column">
      <Text>{prompt}</Text>
      <SelectInput items={items} onSelect={runOnSelect} />
    </Box>
  );
}
