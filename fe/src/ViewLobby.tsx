import React from 'react';

interface Props {}
interface State {
}

export class ViewLobby extends React.Component<Props, State> {
  state: State = {
    data: {
    },
  };
  path() { return 'vote'; }

  render() {
    const { data } = this.state;
    return (
      <div>
        <h1>Vote</h1>

        {data.votes[this.id] ? (
          <h3> you have voted </h3>
        ) : (
          <div>
            <button onClick={() => this.voteSuccess()}>vote SUCCESS</button>
            <button onClick={() => this.voteFail()}>vote FAIL</button>
          </div>
        )}

        <hr/>

        <div>
          <button onClick={() => this.voteClear()}>clear all votes</button>
          <button onClick={() => this.toggleReveal()}>{data.showResults ? 'hide' : 'show'} votes</button>
        </div>

        <hr/>

        <h3>results!</h3>

        {data.showResults && Object.keys(data.votes).length ? (
          <div>
            {Object.keys(data.votes).map(key => (
              <div key={key}>
                {key}: {data.votes[key]}
              </div>
            ))}
          </div>
        ) : (
          <p>
            {Object.keys(data.votes).length} votes counted
          </p>
        )}
      </div>
    );
  }
}
