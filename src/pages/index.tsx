import { render } from 'ink';
import { KeybindingsProvider } from '../components/hooks/useKeybindings';
import { App } from './app';
import { NavProvider } from '../components/navigation/useNav';
import { ThemeProvider } from '../components/hooks/useTheme';
import { ModalProvider } from '../components/modal';
import { TruncationModeProvder } from '../components/hooks/useTruncationMode';

function Root() {
  return (
    <ThemeProvider>
      <NavProvider>
        <KeybindingsProvider>
          <TruncationModeProvder>
            <ModalProvider>
              <App />
            </ModalProvider>
          </TruncationModeProvder>
        </KeybindingsProvider>
      </NavProvider>
    </ThemeProvider>
  );
}

export const renderApp = () => render(<Root />, { patchConsole: true });
