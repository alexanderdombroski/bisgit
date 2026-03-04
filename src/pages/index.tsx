import { render } from 'ink';
import { KeybindingsProvider } from '../components/hooks/useKeybindings';
import { App } from './app';
import { NavProvider } from '../components/navigation/useNav';
import { detectTheme, ThemeProvider } from '../components/hooks/useTheme';
import { ModalProvider } from '../components/modal';
import { TruncationModeProvder } from '../components/hooks/useTruncationMode';
import { StatusProvder } from '../components/hooks/useStatus';

function Root() {
  return (
    <NavProvider>
      <KeybindingsProvider>
        <TruncationModeProvder>
          <ModalProvider>
            <StatusProvder>
              <App />
            </StatusProvder>
          </ModalProvider>
        </TruncationModeProvder>
      </KeybindingsProvider>
    </NavProvider>
  );
}

export const renderApp = async () => {
  const bgColor = await detectTheme();
  render(
    <ThemeProvider bgColor={bgColor}>
      <Root />
    </ThemeProvider>,
    { patchConsole: true }
  );
};
