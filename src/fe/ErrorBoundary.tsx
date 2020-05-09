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
  }

  reset() {
    STORAGE.reset();
    window.location.reload();
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h1>Something went wrong.</h1>
          Try refreshing first. If that doesn't work and you're stuck on this screen, <button onClick={() => this.reset()}>RESET LOCAL DATA</button>
        </div>
      );
    }
    return this.props.children;
  }
}
