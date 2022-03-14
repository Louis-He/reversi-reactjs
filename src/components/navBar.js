import React from 'react';
import {Navbar, Nav, Alert} from "react-bootstrap";
import {Github} from 'react-bootstrap-icons';


export default class MyNavbar extends React.Component {
  render(){
    return (
      <div>
        <Navbar bg="light" expand="lg">
          <Navbar.Brand href="/">
            <img
              src="/fase.png"
              height="60"
              className="d-inline-block align-top"
              alt="React Bootstrap logo" fluid
            />
          </Navbar.Brand>
          <Navbar.Brand href="/">APS105 Reversi Interactive Platform</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="/leaderboard">LeaderBoard</Nav.Link>
              <Nav.Link href="https://github.com/Louis-He/reversi-reactjs"><Github />Source Code</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Alert variant="warning">
          {/* Development is now complete. You can now access leaderboard and your personal page. Let the competition begin (ง •.•)ง !  */}
          The system in now under active hot update. You may experience some delay/time-out when accessing this system.
        </Alert>
      </div>
    );
  }
}