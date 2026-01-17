import { render } from 'ink';
import { KeybindingsProvider } from '../components/hooks/useKeybindings';
import { App } from './app';
import { NavProvider } from '../components/navigation/useNav';

function Root() {
  return (
    <NavProvider>
      <KeybindingsProvider>
        <App />
      </KeybindingsProvider>
    </NavProvider>
  );
}

export const renderApp = () => render(<Root />, { patchConsole: true });
