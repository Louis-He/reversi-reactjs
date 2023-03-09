import React from 'react';
import './index.css';
import {ProgressBar, Button, Badge, Col, Row, InputGroup, FormControl} from "react-bootstrap";
import * as Icon from 'react-bootstrap-icons';

import MyNavbar from "./components/navBar.js"
import MyFooter from "./components/footer.js"

const indexUrl = "http://localhost:8090"

class Headline extends React.Component {
  render() {
    return (
      <div className="position-relative overflow-hidden text-center leaderboard-headline">
        {/* <div className="col-md-5 p-lg-3 mx-auto my-5"> */}
        <Col md="5" className="p-lg-3 mx-auto my-5">
        <h1 className="display-4 font-weight-normal display-sm-3">APS105S Leaderboard</h1>
        </Col>
      </div>
    )
  }
}

class Leadertable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      leaderBoardList: [],
    }
  }

  componentDidMount() {
    fetch(indexUrl + "/api/getLeaderBoard", {
      "method": "GET",
      "headers": {
        "accept": "application/json"
      },
    })
    .then(response => response.json())
    .then(response => {
      console.log(response.data)
      this.setState({
        leaderBoardList: response.data,
        updatedTime: response.update,
      })
    })
    .catch(err => {
      console.log(err)
    });
  }


  render() {
    var leaderBoardRender = []
    
    var idx = 1
    this.state.leaderBoardList.forEach(element => {
      var smartBadge
      var badge = <Badge bg="success">PASS</Badge>
      
      if (element['smartest'] && element['smarter']) {
        smartBadge = <span style={{color:"orange"}}><Icon.AwardFill /></span>
      } else if (element['smartest']) {
        smartBadge = <span style={{color:"orange"}}><Icon.Award /></span>
      } else if (element['smarter']) {
        smartBadge = <span style={{color:"#CCCC00"}}><Icon.Award /></span>
      }

      if (!element['all_valid'] || element['time_out']) {
        badge = []
      }
      if (!element['all_valid']) {
        badge.push(<span className="badge badge-danger">IM</span>)
      }
      if (element['time_out']) {
        badge.push(<span className="badge badge-warning">TLE</span>)
      }

      leaderBoardRender.push(<Row>
        <Col xs={1}>{idx}{smartBadge}</Col>
        <Col xs={3}>{element['id']}</Col>
        <Col xs={2}>{element['score']}</Col>
        <Col xs={4} style={{margin: "auto"}}><ProgressBar now={element['indicator']} label={`${element['indicator']} %`}/></Col>
        <Col xs={2}>{badge}</Col>
      </Row>);
      idx += 1;
    });


    return (
      <div className="container" style={{marginTop: "30px", textAlign: "center", fontFamily: "Source Sans Pro", fontSize: "22px"}}>
        <h3 style={{fontWeight: "bold"}}> Reversi Project Top Leaderboard </h3>
        <Row style={{marginTop: "20px"}}>
          <Col xs={1}>Rank</Col>
          <Col xs={3}>Student</Col>
          <Col xs={2}>Score</Col>
          <Col xs={4}>Indicator</Col>
          <Col xs={2}>Status</Col>
        </Row>
        <Row>
          <Col xs={1}>0<span style={{color:"orange"}}><Icon.AwardFill /></span></Col>
          <Col xs={3}>SiweiHe</Col>
          <Col xs={2}>∞</Col>
          <Col xs={4} style={{margin: "auto"}}><ProgressBar now={100} label={"∞ %"}/></Col>
          <Col xs={2}><Badge bg="success">PASS</Badge></Col>
        </Row>
        {leaderBoardRender}
        
        <Row style={{textAlign: "center"}}>
          {/* <Col style={{marginTop: "20px", marginBottom: "20px", color: "darkgreen"}}>Let the competition Begin! Updated at: {this.state.updatedTime}</Col> */}
          <Col style={{marginTop: "20px", marginBottom: "20px", color: "darkgreen"}}>Competition hasn't started.</Col>
        </Row>
      </div>
    )
  }
}


class Linktoindividual extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      studentID:     '',
      studentPIN:    '',
      alert: '',

      is_check_disabled: true,
    }
  }

  rankCheck() {
    if(this.state.studentID == '' || this.state.studentPIN == '')
    {
      this.setState({
        alert: 'Invalid Input',
      })
      return false;
    }else{
      this.setState({
        alert: '',
      })
    }
    window.location.href='/result/' + this.state.studentID + '/' + this.state.studentPIN
  }


  render() {
    return (
      <div className="container">
        <div>
          <h4 style={{marginBottom: "20px"}}>Find your own ranking</h4>
        </div>
        <Row>
          <Col>
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">Username</InputGroup.Text>
              <FormControl
                placeholder="Your Utorid"
                aria-label="Username"
                aria-describedby="basic-addon1"
                onChange={e => this.setState({ studentID: e.target.value })}
              />
            </InputGroup>
          </Col>
          <Col>
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon2">PIN</InputGroup.Text>
              <FormControl
                placeholder="PIN on Quercus"
                aria-label="PIN"
                aria-describedby="basic-addon2"
                onChange={e => this.setState({ studentPIN: e.target.value.replace(/\D/g, '') })}
              />
            </InputGroup>
          </Col>
        </Row>
        <Row>
          <Button 
            variant="primary"
            disabled={this.state.is_check_disabled}
            onClick={e => this.rankCheck()}
          >Check My Rank</Button>
        </Row>
        <h4 style={{marginBottom: "20px",color:"orange"}}>{this.state.alert}</h4>
      </div>
    )
  }
}

class Explanation extends React.Component {
  render() {
    return (
      <div className="container" style={{marginTop: "20px", fontFamily: 'Source Sans Pro', fontSize: "20px"}}>
        {/* <p><a href="./logs/">Detailed logs</a></p> */}
        {/* <p><a href="./logs.tar.gz">Detailed logs archive</a> (use the command "tar zxf logs.tar.gz" to expand)</p> */}
        <h5><strong>Smart Badge</strong></h5>
        <p>
          If you see a badge <span style={{color:"orange"}}><Icon.AwardFill /></span> in "Rank" column, that means your AI beats both aps105-smarter and aps105-smartest.
          If you see a badge <span style={{color:"orange"}}><Icon.Award /></span> in "Rank" column, that means your AI beats aps105-smartest, but not aps105-smarter.
          If you see a badge <span style={{color:"#CCCC00"}}><Icon.Award /></span> in "Rank" column, that means your AI beats aps105-smarter, but not aps105-smartest.
        </p>
        <h5><strong>Remark Explanation:</strong></h5>
        <p>The remark listed above will <strong>NOT</strong> disqualify your AI if it was not a <span><Badge bg="success">PASS</Badge></span>. 
          Your score listed here will be your final score if the output of the
          program is deterministic. However, you may want to debug your AI if you see a <span><Badge bg="danger">IM</Badge></span>, 
          or improve the efficiency of your AI if you see a <span><Badge bg="warning">TLE</Badge></span>. Good luck and have fun designing your AI!</p>
        <p><span><Badge bg="success">PASS</Badge></span> Pass. Your AI's all moves were valid and all matches finished
          successfully.</p>
        <p><span><Badge bg="danger">IM</Badge></span> Invalid Move. Your AI made at least one invalid move when competing
          against other
          classmates' AI.</p>
        <p><span><Badge bg="warning">TLE</Badge></span> Time Limit Exceed. Your AI timed out at least once when competing
          against other
          classmates' AI.</p>
        <h5><strong>Disqualified players:</strong></h5>
        <p>[None]</p>
        <h5><strong>Leaderboard rules:</strong></h5>
        {/* <p>AIs that win at least three games (out of four) against aps105-smarter and aps105-smartest are chosen to
          advance
          to the finals.</p> */}
        <p>Two games are played between each pair of finalists, and the results are scored and ranked.</p>
        {/* <h5><strong>Rules for computing the scores used for ranking</strong>:</h5>
        <p>A game won earns a score equal to the ratio of the winner's over the loser's pieces on the board, with a
          maximum
          score of 2. If a game is won due to a timed out or invalid move made by the opponent, the winner earns a score
          of
          2.</p>
        <p>A game lost earns a score of 0.</p>
        <p>A tie earns a score between 0 and 1, depending on the amount of time each player used (shorter times earn
          higher
          scores), as a fraction of the total time for both players.</p>
        <p>Last updated: 
        </p> */}
      </div>
    )
  }
}


class Leaderboard extends React.Component {
  componentDidMount() {
    document.title = 'APS105H1S 2021 Leaderboard';
  }

  render() {
      return (
        <div style={{height: "100%"}}>
          <MyNavbar />
          <Headline />
          <Leadertable />
          <hr style={{ marginTop: "20px" }}/>
          <Linktoindividual />
          <hr style={{ marginTop: "20px" }}/>
          <Explanation/>
          <MyFooter />
        </div>
  )}

}

// ========================================
export default Leaderboard;
