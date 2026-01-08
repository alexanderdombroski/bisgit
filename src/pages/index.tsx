import { render } from 'ink';
import { KeybindingsProvider } from '../components/hooks/useKeybindings';
import { App } from './app';

function Root() {
  return (
    <KeybindingsProvider>
      <App />
    </KeybindingsProvider>
  );
}

export const renderApp = () => render(<Root />, { patchConsole: true });
