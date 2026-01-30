import { Text, useApp, useInput } from 'ink';
import { useState } from 'react';
import { WithProgress } from './withProgress';

type Props = {
  prompt: string;
  msg: string;
  onConfirm: () => Promise<string>;
  requireConfirmation?: boolean;
};

export function Confirmation({ prompt, msg, onConfirm, requireConfirmation }: Props) {
  const [answer, setAnswer] = useState<string>('');
  const { exit } = useApp();

  useInput((input, key) => {
    if (answer) return;

    const normalized = input.toLowerCase();
    if (normalized === 'y' || (key.return && !requireConfirmation)) {
      setAnswer('Yes');
    } else if (normalized === 'n' || (key.return && requireConfirmation)) {
      setAnswer('No');
      exit();
    }
  });

  return (
    <>
      <Text>
        {prompt} [{requireConfirmation ? 'y/N' : 'Y/n'}] {answer}
      </Text>
      {answer === 'Yes' && <WithProgress msg={msg} promise={onConfirm()} />}
    </>
  );
}
