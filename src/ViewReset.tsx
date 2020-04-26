import React from 'react';
import { UserState } from './types';

interface Props {
  storage: UserState,
  reset(): void;
}
interface State { }

export class ViewReset extends React.Component<Props, State> {
  tryReset() {
    const { game } = this.props.storage;
    let confirmed = true;
    if (game) {
      confirmed = window.confirm("Are you sure you want to reset?\nIf you leave a game in progress, you will not be able to rejoin.");
    }
    if (confirmed) {
      this.props.reset();
    }
  }
  render() {
    const { storage } = this.props;
    return (
      <div>
        <h1>Current Local State</h1>
        <pre>
          {JSON.stringify(storage, null, 2)}
        </pre>
        <div>
          <button onClick={() => this.tryReset()}>reset everything</button>
        </div>
      </div>
    );
  }
}
