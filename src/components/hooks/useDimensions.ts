import { useStdout } from 'ink';

export function useDimensions() {
  const { stdout } = useStdout();
  const sectionHeight = stdout.rows - 2;
  const sectionHalfHeight = Math.floor(sectionHeight / 2);
  let modalWidth;
  if (stdout.columns > 64) {
    modalWidth = 60;
  } else if (stdout.columns > 60) {
    modalWidth = 48;
  } else {
    modalWidth = stdout.columns - 4;
  }
  return {
    width: stdout.columns,
    height: stdout.rows,
    sectionHeight,
    sectionHalfHeight,
    modalWidth,
  };
}
