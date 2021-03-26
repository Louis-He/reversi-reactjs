import React from 'react';
import './index.css';

import MyNavbar from "./components/navBar.js"
import MyFooter from "./components/footer.js"
import * as Icon from 'react-bootstrap-icons';

import Chart from "react-google-charts";
import {Modal, Button, Col, Image, Row} from "react-bootstrap";

const indexUrl = "http://142.150.239.187:8090"

class PersonalInfo extends React.Component {
  componentDidMount() {
    fetch(indexUrl + "/api/getRanking/" + this.props.studentID + "/" + this.props.studentPIN, {
      "method": "GET",
      "headers": {
        "accept": "application/json",
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(response => {
      this.setState({
        access: response.status,
      })
    })
    .catch(err => {
        console.log(err)
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      access:         false,
      studentID:      props.studentID,
      studentPIN:     props.studentPIN,
      smarterPassed:  false,
      smartestPassed: false,
      allPassed:      false,
      timeout:        true,
      rankingUp:      false,
      rankingDown:    false,
    }
  }
  render() {
    const data = [
      ["Time", "Rank"],
      ["1", 528],
    ];
    const options = {
      title: "Ranking",
      legend: { position: "bottom" },
      vAxis: {
        direction: -1,
      },
    };

    if (!this.state.access) {
      return  (
        <div>
          <MyNavbar />
          <div className='ml-5 mr-5 pl-3 pr-3'>
            <h5>ACCESS DENIED.</h5>
          </div>
          <MyFooter />
      </div>
      );
    }
    let smarterPassedRender;
    let smartestPassedRender;
    let allPassedRender;
    let timeoutRender;
    let rankingIndicateRender;
    if (this.state.smarterPassed) {
      smarterPassedRender = <div style={{display: "flex", alignItems: "center", fontSize: "22px", color: "green"}}>
        <Icon.PatchCheckFill />  &nbsp;Passed APS105-smarter
      </div>
    } else {
      smarterPassedRender = <div style={{display: "flex", alignItems: "center", fontSize: "22px", color: "red"}}>
        <Icon.PatchExclamationFill />  &nbsp;Failed APS105-smarter
      </div>
    }

    if (this.state.smartestPassed) {
      smartestPassedRender = <div style={{display: "flex", alignItems: "center", fontSize: "22px", color: "green"}}>
        <Icon.PatchCheckFill />  &nbsp;Passed APS105-smartest
      </div>
    } else {
      smartestPassedRender = <div style={{display: "flex", alignItems: "center", fontSize: "22px", color: "red"}}>
        <Icon.PatchExclamationFill />  &nbsp;Failed APS105-smartest
      </div>
    }

    if (!this.state.smarterPassed) {
      allPassedRender = <div style={{display: "flex", alignItems: "center", fontSize: "22px", color: "gray"}}>
        <Icon.DashCircleFill /> &nbsp;Evaluation on competition not available
      </div>
    } else if (this.state.allPassed) {
      allPassedRender = <div style={{display: "flex", alignItems: "center", fontSize: "22px", color: "green"}}>
        <Icon.PatchCheckFill /> &nbsp;Passed all competition
      </div>
    } else {
      allPassedRender = <div style={{display: "flex", alignItems: "center", fontSize: "22px", color: "red"}}>
        <Icon.PatchExclamationFill /> &nbsp;Failed some competitions (Invalid Move)
      </div>
    }

    if (!this.state.smarterPassed) {
      timeoutRender = <div style={{display: "flex", alignItems: "center", fontSize: "22px", color: "gray"}}>
        <Icon.DashCircleFill /> &nbsp;Evaluation on timeout unavailable
      </div>
    } else if (!this.state.timeout) {
      timeoutRender = <div style={{display: "flex", alignItems: "center", fontSize: "22px", color: "green"}}>
        <Icon.PatchCheckFill />  &nbsp;No timeout case
      </div>
    } else {
      timeoutRender = <div style={{display: "flex", alignItems: "center", fontSize: "22px", color: "red"}}>
        <Icon.BugFill />  &nbsp;At least one timeout case
      </div>
    }

    if (!this.state.smarterPassed) {
      rankingIndicateRender = <div style={{display: "flex", alignItems: "center", fontSize: "22px", color: "gray"}}>
        <Icon.DashCircleFill />  &nbsp;Ranking Not Available
      </div>
    } else if (this.state.rankingDown) {
      rankingIndicateRender = <div style={{display: "flex", alignItems: "center", fontSize: "22px", color: "orange"}}>
        <Icon.ArrowDownCircleFill />  &nbsp;Ranking down
      </div>
    } else {
      rankingIndicateRender = <div style={{display: "flex", alignItems: "center", fontSize: "22px", color: "green"}}>
        <Icon.ArrowUpCircleFill />  &nbsp;Ranking up
      </div>
    }

    return (
      <div>
        <MyNavbar />

        <div className='ml-5 mr-5 pl-3 pr-3'>
          <Row className='p-3 mb-3'>
            <Col><h4>Student: {this.state.studentID}</h4></Col>
          </Row>
          <div style={{borderStyle: "solid"}} className='shadow-lg p-4 mb-5 bg-white rounded'>
            <Row style={{padding: "10px"}}>
              <Col xs={5} style={{textAlign: "-webkit-center"}}>
                <div class="res-circle">
                  <div class="circle-txt" style={{color: "gray"}}>--</div>
                </div>
              
              </Col>
              
              <Col xs={7} >
                <div style={{display: "flex", alignItems: "center", fontSize: "22px", color: "orange"}}>
                  <Icon.EmojiDizzyFill />  &nbsp;Result Not available yet
                </div>
                {smarterPassedRender}
                {smartestPassedRender}
                {allPassedRender}
                {timeoutRender}
                {rankingIndicateRender}
              </Col>
            </Row>
            <Row>
            <Col xs={12} >
                <Chart
                  chartType="LineChart"
                  width="100%"
                  height="600px"
                  data={data}
                  options={options}
                />
              </Col>
            </Row>
          </div>
          
        </div>
        <MyFooter />
      </div>
    )


  }
}

// ========================================
export default PersonalInfo;