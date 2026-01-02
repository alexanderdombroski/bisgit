import { Text, useApp, useInput } from 'ink';
import { useState } from 'react';
import { WithProgress } from './withProgress';

type Props = {
	prompt: string;
	msg: string;
	onConfirm: () => Promise<string>;
};

export function Confirmation({ prompt, msg, onConfirm }: Props) {
	const [answer, setAnswer] = useState<string>('');
	const { exit } = useApp();

	useInput((input, key) => {
		if (answer) return;

		const normalized = input.toLowerCase();
		if (normalized === 'y') {
			setAnswer('Yes');
		} else if (normalized === 'n' || key.return) {
			setAnswer('No');
			exit();
		}
	});

	return (
		<>
			<Text>
				{prompt} [y/N] {answer}
			</Text>
			{answer === 'Yes' && <WithProgress msg={msg} promise={onConfirm()} />}
		</>
	);
}
