import { useStdout } from 'ink';

export function useDimensions() {
  const { stdout } = useStdout();
  const sectionHeight = stdout.rows - 2;
  const sectionHalfHeight = Math.floor(sectionHeight / 2);
  const modalWidth = stdout.columns > 100 ? 96 : stdout.columns - 4;

  return {
    width: stdout.columns,
    height: stdout.rows,
    sectionHeight,
    sectionHalfHeight,
    modalWidth,
  };
}
