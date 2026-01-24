/**
 * A context provider that catches async errors and attempts them
 * syncrounously so an error boundry can catch them
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from 'react';
import type { GenericError } from '../errorBoundry';

type AsyncFn<Args extends any[]> = (...args: Args) => Promise<any>;

type ErrorCatcherType<Args extends any[]> = {
  /** Call async function and rethrow async errors as syncronous ones */
  attempt: (callback: AsyncFn<Args>, ...args: Args) => void;
  err?: string;
};

const ErrorCatcher = createContext({} as ErrorCatcherType<any[]>);

export function ErrorCatcherProvder<Args extends any[]>({ children }: PropsWithChildren) {
  const [err, setErr] = useState<string>();

  const attempt = (callback: AsyncFn<Args>, ...args: Args) => {
    callback(...args).catch((error) =>
      setErr((error as GenericError).stderr ?? (error as Error).message)
    );
  };

  useEffect(() => {
    if (err) {
      throw new Error(err);
    }
  }, [err]);

  return <ErrorCatcher.Provider value={{ attempt, err }}>{children}</ErrorCatcher.Provider>;
}

export function useErrorCatcher(): ErrorCatcherType<any[]> {
  const context = useContext(ErrorCatcher);
  if (Object.keys(context).length === 0) {
    throw new Error('useErrorCatcher must be used within an ErrorCatcherProvider');
  }
  return context;
}
