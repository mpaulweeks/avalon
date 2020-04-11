import React from "react";
import {
  HashRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { ViewDebug } from "./ViewDebug";
import { ViewVote } from "./ViewVote";
import { ViewLobby } from "./ViewLobby";
import { ViewReset } from "./ViewReset";

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
                <Link to="/">Game</Link>
              </li>
              <li>
                <Link to="/vote">Vote</Link>
              </li>
              <li>
                <Link to="/reset">Reset</Link>
              </li>
              <li>
                <Link to="/debug">Debug</Link>
              </li>
            </ul>
          </nav>

          {/* A <Switch> looks through its children <Route>s and
              renders the first one that matches the current URL. */}
          <Switch>
            <Route path="/vote">
              <ViewVote />
            </Route>
            <Route path="/reset">
              <ViewReset />
            </Route>
            <Route path="/debug">
              <ViewDebug />
            </Route>
            <Route path="/">
              <ViewLobby />
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}
