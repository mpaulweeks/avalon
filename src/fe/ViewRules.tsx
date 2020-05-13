import React from 'react';

interface Props { }
interface State { }

export class ViewRules extends React.Component<Props, State> {
  render() {
    return (
      <div>
        <h1>
          Rules (<a target="_blank" href="rules.pdf">Rulebook.pdf</a>)
        </h1>
        <div>
          <img src="roles.gif" alt="character rules" style={{
            height: 'auto',
            width: '106vh',
            maxWidth: '100%',
            border: '1px solid black',
          }} />
        </div>
        <div>
          <i>visualization courtesy of Adam Chawansky</i>
        </div>
      </div>
    );
  }
}
