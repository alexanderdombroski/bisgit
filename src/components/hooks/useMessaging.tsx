/**
 * Context Provider intended to help section groups communicate with each other
 */

import { createContext, useContext, useState, type PropsWithChildren } from 'react';

type MessagingType = {
  /** Attempt to receive a message */
  receiveMessage: (msg: string) => boolean;
  /** Send a message for another group to receive */
  sendMessage: (msg: string) => void;
};

const Messaging = createContext({} as MessagingType);

export function MessagingProvder({ children }: PropsWithChildren) {
  const [message, setMessage] = useState<string>();
  const sendMessage = (msg: string) => setMessage(msg);
  const receiveMessage = (msg: string) => {
    const expected = message === msg;
    if (expected) setMessage(undefined);
    return expected;
  };

  return (
    <Messaging.Provider value={{ sendMessage, receiveMessage }}>{children}</Messaging.Provider>
  );
}

export function useMessaging(): MessagingType {
  const context = useContext(Messaging);
  if (Object.keys(context).length === 0) {
    throw new Error('useMessaging must be used within an MessagingProvider');
  }
  return context;
}
