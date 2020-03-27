import React from "react";
import {
  HashRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { ViewDebug } from "./ViewDebug";
import { ViewVote } from "./ViewVote";

function Home() {
  return <h1>Avalon Online(alpha)</h1>;
}

export class ViewHub extends React.Component {
  componentDidMount() {
    // todo store persistant unique id in localStorage
  }
  render() {
    return (
      <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/vote">Vote</Link>
              </li>
              <li>
                <Link to="/debug">Debug</Link>
              </li>
            </ul>
          </nav>

          {/* A <Switch> looks through its children <Route>s and
              renders the first one that matches the current URL. */}
          <Switch>
            <Route path="/debug">
              <ViewDebug />
            </Route>
            <Route path="/vote">
              <ViewVote />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}
