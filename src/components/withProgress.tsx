import React, { Suspense, use, useEffect } from 'react';
import { Text, useApp } from 'ink';
import Spinner from 'ink-spinner';

type Props = {
	msg: string;
	promise: Promise<void | string>;
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

	return <Text>{`\u2714 ${result ?? msg}`}</Text>;
}
