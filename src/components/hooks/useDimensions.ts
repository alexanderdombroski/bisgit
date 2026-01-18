import { useStdout } from 'ink';

export function useDimensions() {
  const { stdout } = useStdout();
  const sectionHeight = stdout.rows - 2;
  const sectionHalfHeight = Math.floor(sectionHeight / 2);
  return { width: stdout.columns, height: stdout.rows, sectionHeight, sectionHalfHeight };
}
