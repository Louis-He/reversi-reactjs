import React from 'react';

import MyNavbar from "./components/navBar.js"
import MyFooter from "./components/footer.js"


class PersonalInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      studentID:     props.studentID,
      studentPIN:    props.studentPIN
    }
  }
  render() {
    return (
      <div>
        <MyNavbar />
        <h3>ID: {this.state.studentID}</h3>
        <h3>PIN: {this.state.studentPIN}</h3>
        <MyFooter />
      </div>
    )
  }
}

// ========================================
export default PersonalInfo;