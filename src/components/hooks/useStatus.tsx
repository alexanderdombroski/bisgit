import { createContext, useContext, type PropsWithChildren } from 'react';
import { getStatus, type FileStatus } from '../../utils/git';
import { useResolved } from './useResolved';

type StatusType = {
  status: FileStatus[];
};

const Status = createContext({} as StatusType);

export function StatusProvder({ children }: PropsWithChildren) {
  const { value: status = [] } = useResolved(getStatus);

  return <Status.Provider value={{ status }}>{children}</Status.Provider>;
}

export function useStatus(): StatusType {
  const context = useContext(Status);
  if (Object.keys(context).length === 0) {
    throw new Error('useStatus must be used within an StatusProvider');
  }
  return context;
}
