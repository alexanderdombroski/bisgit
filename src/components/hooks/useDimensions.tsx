import { useStdout } from 'ink';

export function useDimensions() {
  const { stdout } = useStdout();
  return { width: stdout.columns, height: stdout.rows };
}
