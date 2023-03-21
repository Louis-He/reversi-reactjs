import logo from './logo.svg';
import './App.css';

import React from "react";
import ReactDOM from "react-dom";
import {
    BrowserRouter,
    Routes,
    Route,
    Link,
    useParams,
    useMatch
} from "react-router-dom";
import * as ReactDOMClient from 'react-dom/client';

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
  let { studentID, studentPIN } = useParams();

  return (
    <PersonalInfo studentID={studentID} studentPIN={studentPIN} />
    // <PersonalInfo />
  );
}

function ThirdLevel() {
  let { path, url } = useMatch();
  return (
    <BrowserRouter>
      <Route path={`${path}/:studentPIN`}>
        <PersonalPage />
      </Route>
    </BrowserRouter>
  )
}


function SecondLevel() {
  let { path, url } = useMatch();
  return (
    <BrowserRouter>
      <Route path={`${path}/:studentID`}>
        <ThirdLevel />
      </Route>
    </BrowserRouter>
  )
}

// ReactDOM.render(
//     <Home />,
//     document.getElementById('root')
// );
// ReactDOM.render(<Router>
//     <div>
//       <Route exact path="/">
//         <Home />
//       </Route>
//       <Route path="/leaderboard">
//         <Leaderboard />
//       </Route>
//       <Routes>
//         <Route path="/result">
//           <SecondLevel />
//         </Route>
//       </Routes>
//     </div>
//   </Router>, document.getElementById("root"));

const root = ReactDOMClient.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path={`/result/:studentID/:studentPIN`} element={<PersonalPage />} />
    </Routes>
  </BrowserRouter>
);