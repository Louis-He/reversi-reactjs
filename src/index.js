import logo from './logo.svg';
import './App.css';

import React from "react";
import ReactDOM from "react-dom";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams
} from "react-router-dom";

import Home from "./Home";
import Leaderboard from "./Leaderboard";
import PersonalInfo from "./personalInfo";

function App() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
  
function Homepage() {
    return <Home />;
}

function PersonalPage() {
  // We can use the `useParams` hook here to access
  // the dynamic pieces of the URL.
  // let { studentID, studentPIN } = useParams();

  return (
    // <PersonalInfo studentID={studentID} studentPIN={studentPIN} />
    <PersonalInfo />
  );
}
// ReactDOM.render(
//     <Home />,
//     document.getElementById('root')
// );
ReactDOM.render(<Router>
    <div>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/leaderboard">
        <Leaderboard />
      </Route>
      <Switch>
        <Route path="/result/:studentID/:studentPIN" children={<PersonalPage />} />
      </Switch>
    </div>
  </Router>, document.getElementById("root"));