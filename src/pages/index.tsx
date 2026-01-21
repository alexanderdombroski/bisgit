import { render } from 'ink';
import { KeybindingsProvider } from '../components/hooks/useKeybindings';
import { App } from './app';
import { NavProvider } from '../components/navigation/useNav';
import { ThemeProvider } from '../components/hooks/useTheme';
import { ModalProvider } from '../components/modal';

function Root() {
  return (
    <ThemeProvider>
      <NavProvider>
        <KeybindingsProvider>
          <ModalProvider>
            <App />
          </ModalProvider>
        </KeybindingsProvider>
      </NavProvider>
    </ThemeProvider>
  );
}

export const renderApp = () => render(<Root />, { patchConsole: true });
