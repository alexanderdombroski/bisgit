import { Component, useEffect } from 'react';
import type { ErrorInfo, PropsWithChildren } from 'react';
import { useModal } from './modal';
import { Alert } from './modal/alert';
import { useDimensions } from './hooks/useDimensions';

export type GenericError = {
  message?: string;
  stderr?: string;
};

export class ErrorBoundary extends Component<PropsWithChildren> {
  public state: { hasError: boolean; message?: string } = { hasError: false };

  constructor(props: PropsWithChildren) {
    super(props);
  }

  static getDerivedStateFromError(error: GenericError) {
    // Update state so the next render shows the fallback UI
    const message = error?.stderr ?? (error?.message as string);
    return { hasError: true, message };
  }

  private dismissError() {
    this.setState({ hasError: false });
  }

  // eslint-disable-next-line no-unused-vars
  componentDidCatch(error: GenericError, errorInfo: ErrorInfo) {
    // Log error to an error reporting service
    // console.error('Error caught by ErrorBoundary:', error, errorInfo);
    const message = error?.stderr ?? (error?.message as string);
    this.setState({ hasError: true, message });
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorModal dismissError={this.dismissError.bind(this)} message={this.state.message}>
          {this.props.children}
        </ErrorModal>
      );
    }

    return this.props.children;
  }
}

type ErrorModalProps = PropsWithChildren<{
  message?: string;
  dismissError: () => void;
}>;

export function ErrorModal({ message, dismissError, children }: ErrorModalProps) {
  const { setModal, open } = useModal();
  const { modalWidth } = useDimensions();

  useEffect(() => {
    if (message) {
      const cleanedMessage = message.split(/\r?\n/).map((line) => line.trim());
      setModal(<Alert title="Error" message={cleanedMessage} width={modalWidth} />, {
        onClose: dismissError,
      });
      open();
    }
  }, [message]);

  return children;
}
