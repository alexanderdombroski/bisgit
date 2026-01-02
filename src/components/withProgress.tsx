import React, { Suspense, use, useEffect } from 'react';
import { Text, useApp } from 'ink';
import Spinner from 'ink-spinner';

type Props = {
	msg: string;
	promise: Promise<any>;
};

export function WithProgress(props: Props) {
	const { msg } = props;

	return (
		<Suspense
			fallback={
				<Text>
					<Spinner type="dots" />
					&nbsp;{msg}
				</Text>
			}
		>
			<Result {...props} />
		</Suspense>
	);
}

function Result({ msg, promise }: Props) {
	const result = use(promise);

	const { exit } = useApp();
	useEffect(() => {
		exit();
	}, [result]);

	const completionMessage = typeof result === 'string' ? result : msg;
	return <Text>{`\u2714 ${completionMessage}`}</Text>;
}
