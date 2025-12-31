import React, { Suspense, use } from 'react';
import { Text } from 'ink';
import Spinner from 'ink-spinner';

type Props = {
	msg: string;
	promise: Promise<void>;
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
	use(promise);
	return <Text>{`\u2714 ${msg}`}</Text>;
}
