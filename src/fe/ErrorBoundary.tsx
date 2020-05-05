import React, { ErrorInfo } from 'react';
import { STORAGE } from '../core/storage';

interface Props {}
interface State {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = {
    hasError: false,
  };

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.log('error caught by boundary!', error, info);
    this.setState({ hasError: true });
    setTimeout(() => {
      STORAGE.reset();
      window.location.reload();
    }, 3000);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. Reseting in 3 seconds...</h1>;
    }
    return this.props.children;
  }
}
