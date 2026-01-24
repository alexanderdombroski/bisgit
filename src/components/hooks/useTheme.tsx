import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs/promises';
import { createContext, type PropsWithChildren, useContext } from 'react';
import { useResolved } from './useResolved';
import { exists } from '../../utils/fs';

type ThemeContextType = {
  bgColor?: string;
};

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

export function ThemeProvider({ children }: PropsWithChildren) {
  const { value: bgColor } = useResolved(getTerminalBackgroundColor);
  return <ThemeContext.Provider value={{ bgColor }}>{children}</ThemeContext.Provider>;
}

// Hook to use the context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (Object.keys(context).length === 0) {
    throw new Error('useKeybindings must be used within a KeybindingsProvider');
  }
  return context;
};

// ---------- Utilities ----------

/**
 * Attempts to detect the terminal background color using ANSI OSC 11.
 * @returns Hex color
 */
async function getTerminalBackgroundColor(): Promise<string | undefined> {
  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    return undefined;
  }

  if (process.env.TERM_PROGRAM === 'vscode') {
    return await getThemeFromVSCode();
  }

  return new Promise<string | undefined>((resolve) => {
    const QUERY = '\x1b]11;?\x07';
    let buffer = '';
    let timeout: NodeJS.Timeout;

    const cleanup = (result?: string) => {
      clearTimeout(timeout);
      process.stdin.off('data', onData);
      try {
        process.stdin.setRawMode(false);
        process.stdin.pause();
      } catch {}
      resolve(result);
    };

    // OSC 11 query: "Report background color"
    const onData = (data: Buffer | string) => {
      buffer += data.toString('ascii');

      // Expected response format:
      // ESC ] 11 ; rgb:RRRR/GGGG/BBBB BEL
      const match = buffer.match(
        /\x1b]11;rgb:([0-9a-fA-F]{1,4})\/([0-9a-fA-F]{1,4})\/([0-9a-fA-F]{1,4})\x07/
      );

      if (match) {
        const hex = rgbToHex(match[1], match[2], match[3]);
        cleanup(hex);
      }
    };

    try {
      process.stdin.setRawMode(true);
      process.stdin.resume();
      process.stdin.on('data', onData);

      // Fail fast if terminal doesn't respond
      timeout = setTimeout(() => cleanup(undefined), 150);

      process.stdout.write(QUERY);
    } catch {
      cleanup(undefined);
    }
  });
}

function rgbToHex(r: string, g: string, b: string) {
  return (
    '#' +
    [r, g, b]
      .map((n) => {
        const v8bit = Math.round((parseInt(n, 16) * 255) / ((1 << (4 * n.length)) - 1));
        return v8bit.toString(16).padStart(2, '0');
      })
      .join('')
  );
}

async function getThemeFromVSCode(): Promise<string | undefined> {
  let appName = 'Code';
  if (process.env.TERM_PROGRAM_VERSION?.includes('insider')) {
    appName = 'Code - Insiders';
  }

  let configPath;
  switch (process.platform) {
    case 'win32':
      configPath = path.join(os.homedir(), 'AppData', 'Roaming', appName, 'User', 'settings.json');
      break;
    case 'linux':
      configPath = path.join(os.homedir(), '.config', appName, 'User', 'settings.json');
      break;
    case 'darwin':
      configPath = path.join(
        os.homedir(),
        'Library',
        'Application Support',
        appName,
        'User',
        'settings.json'
      );
      break;
    default:
      return undefined;
  }

  if (!(await exists(configPath))) {
    return undefined;
  }

  const settingsText = await fs.readFile(configPath, { encoding: 'utf-8' });
  const { default: stripComments } = await import('strip-json-comments');
  const clean = stripComments(settingsText).replace(/,\s*(\}|\])/g, '$1'); // remove trailing commas and comments
  const settings: { 'workbench.colorTheme'?: string } = JSON.parse(clean);

  switch (settings['workbench.colorTheme']) {
    case 'Default Dark Modern':
    case undefined:
      return '#181818';
    case 'Visual Studio Dark':
    case 'Default Dark+':
      return '#1e1e1e';
    case 'Default High Contrast':
      return '#000000';
    case 'Default Light+':
    case 'Visual Studio Light':
    case 'Default High Contrast Light':
      return '#ffffff';
    case 'Default Light Modern':
      return '#f8f8f8';
    default:
      return undefined;
  }
}
