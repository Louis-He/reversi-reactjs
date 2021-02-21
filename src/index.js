import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, Col, Image, Row} from "react-bootstrap";
// import BootstrapSwitchButton from 'bootstrap-switch-button-react'
// import { Button } from '@material-ui/core';
import * as Icon from 'react-bootstrap-icons';
import logo from './fase.png'

function Square(props) {
    const chess = props.value === 1 ? '●': (props.value === 2 ? '○' : '');

    if (props.checkedHint && props.value === 3) {
        return (
            <button style={{color: "orange", fontFamily: "sans-serif"}} className="square" onClick={props.onClick}>
                {props.is_x_next ? '●': '○'}
            </button>
        );
    } else {
        return (
            <button style={{fontFamily: "sans-serif"}} className="square" onClick={props.onClick}>
                {chess}
            </button>
        );
    }
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
                checkedHint = {this.props.checkedHint}
                is_x_next = {this.props.is_x_next}
            />
        );
    }

    render() {
        const board = [];
        for(let i = 0; i < this.props.dimension; i++){
            const row = [];
            for(let j = 0; j < this.props.dimension; j++){
                row.push(this.renderSquare(i * this.props.dimension + j));
            }
            board.push(<div className='board-row'>{row}</div>);
        }

        return (
            <div>
                {board}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        let original_board = Array(64).fill(0);
        // initialize the board
        original_board[3 * 8 + 3] = 1;
        original_board[3 * 8 + 4] = 2;
        original_board[4 * 8 + 3] = 2;
        original_board[4 * 8 + 4] = 1;

        let hint_board = original_board.slice();

        this.hintMove(hint_board, true);

        this.state = {
            history: [{
                squares: original_board
            }],
            is_x_next: true,
            stepNumber: 0,
            checkedHint: false,
            latest_squares: hint_board,
            is_player_vs_computer: true,

            // dropdown menu
            dropdown_arr: ["APS105-smarter", "APS105-smartest", "sandbox"],
            selector: 0,

            // switch side button
            player: true, // true: black, false: white
        };
    }

    //############ Util Functions #############//
    is_xy_out_of_bound(dim, x, y){
        if(x < 0 || y < 0) return true;
        if(x >= dim || y >= dim) return true;

        return false;
    }

    map_xy_to_arr(dim, _xy) {
        return _xy.y * dim + _xy.x;
    }
    
    map_arr_to_xy(dim, i) {
        const _y = Math.floor(i / dim);
        return {x: i - dim * _y, y: _y}
    }

    //############ Helper Functions #############//
    // check whether the game finishes and if finished, who wins
    calculateScore(board) {
        console.log("CS")
        console.log(board)
        let black_score = 0;
        let white_score = 0;
        for(let i = 0; i < 64; i++){
            if (board[i] === 1) { black_score++; }
            else if (board[i] === 2) { white_score++; }
        }


        if((!this.anyMove(board, true)) && (!this.anyMove(board, false))){
            if ( black_score > white_score ) { return {end: true, win: 1, black: black_score, white: white_score} }
            else if ( black_score === white_score) { return {end: true, win: 0, black: black_score, white: white_score} }
            else { return {end: true, win: 2, black: black_score, white: white_score} }
        }

        return {end: false, black: black_score, white: white_score}
    }

    // Check whether the player has any valid move
    anyMove(board, is_x_next) {
        for(let i = 0; i < 64; i++){
            const validation_check = this.checkMove(board, i, is_x_next);
            if (validation_check.move_check) {
                return true;
            }
        }
        return false;
    }

    // Check whether the player has any valid move and mark the valid moves
    // return: true if the player has any valid move
    // Note: board will be changed in-place
    hintMove(board, is_x_next) {
        console.log('hint')
        console.log(board)
        let any_valid = false;
        for(let i = 0; i < 64; i++){
            const validation_check = this.checkMove(board, i, is_x_next);
            if (validation_check.move_check) {
                board[i] = 3;
                any_valid = true;
            }
        }
        return any_valid;
    }

    // Check whether a move on the board is legal
    // Return: {move_check: bool, direction_checks: 2D array of bool [3 * 3], msg: string};
    // Notice: If move_check is false, direction_checks will be null
    checkMove(board, i, is_x_next) {
        if (board[i] !== 0 && board[i] !== 3) {
            return {move_check: false, msg: "Spot already taken"};
        }

        const player = is_x_next ? 1 : 2;
        const opponent = is_x_next ? 2 : 1;

        let target_xy = this.map_arr_to_xy(8, i);
        let is_legal = false;
        let validation_check = []; // indicates whether the move is valid regards 9 different directions. (middle one is meaningless)
        let overall_check = false; // indicates whether the move is valid or not

        for(let look_down = -1; look_down <= 1; look_down++){
            if(is_legal) { break; }
            let validation_row = []
            for(let look_right = -1; look_right <= 1; look_right++) {
                if(look_down === 0 && look_right === 0) { validation_row.push(false);continue; }
                if(is_legal) { break; }
                let current_xy = JSON.parse(JSON.stringify(target_xy));
                while(true){
                    current_xy.y += look_down;
                    current_xy.x += look_right;
                    if(this.is_xy_out_of_bound(8, current_xy.x, current_xy.y)){
                        is_legal = false;
                        break;
                    }

                    let current_i = this.map_xy_to_arr(8, current_xy);
                    if(board[current_i] === opponent){
                        is_legal = true;
                    }else if(board[current_i] === player){
                        break;
                    }else if(board[current_i] === 0 || board[current_i] === 3){
                        is_legal = false;
                        break;
                    }
                }
                validation_row.push(is_legal);
                if (is_legal) {
                    overall_check = true;
                }
                is_legal = false;
            }
            validation_check.push(validation_row);
        }

        return {move_check: overall_check, direction_checks: validation_check, msg: "Illegal Move"};
    }

    // Make a move on the board
    // Return: None
    // Notice: 1. ALWAYS call checkMove before call this function
    //         2. board will be modified
    makeMove(board, i, validation_check_arr, is_x_next) {
        const player = is_x_next ? 1 : 2;
        const opponent = is_x_next ? 2 : 1;
        let target_xy = this.map_arr_to_xy(8, i);
        board[i] = player;

        for(let look_right = -1; look_right <= 1; look_right++){
            for(let look_down = -1; look_down <= 1; look_down++){
                if (look_right === 0 && look_down === 0) {continue;}

                if(validation_check_arr[look_down + 1][look_right + 1]){
                    let current_xy = JSON.parse(JSON.stringify(target_xy));
                    current_xy.x += look_right;
                    current_xy.y += look_down;
                    while(board[this.map_xy_to_arr(8, current_xy)] === opponent){
                        board[this.map_xy_to_arr(8, current_xy)] = player;
                        current_xy.x += look_right;
                        current_xy.y += look_down;
                    }
                }
            }
        }
    }

    endMoveWrapper(board, is_x_next) {
        console.log("endMoveWrapper")
        console.log(board)

        this.endMove(board, is_x_next);
        // console.log(next_is_x)

        // if (!(next_is_x === this.state.player)) {
        //     if (this.state.dropdown_arr[this.state.selector] !== "sandbox"){
        //         this.opponentMoveWrapper(board);
        //     }
        // }
    }

    endMove(board, is_x_next) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        let is_end = this.calculateScore(board).end;
        console.log("is_end: " + is_end)

        let hint_board = board.slice();

        this.hintMove(hint_board, !is_x_next);

        let next_player = is_x_next;
        if (!is_end) {
            next_player = !is_x_next;
            if (this.anyMove(board, next_player)) {
                this.setState({
                    is_x_next: next_player,
                })
            }
        }

        return this.setState({
            history: history.concat([{
                squares: board
            }]),
            latest_squares: hint_board,
            stepNumber: history.length,
        }, function() {
            console.log("endMove - callback")
            if(is_end){
                return
            }

            if (!(next_player === this.state.player)) {
                if (this.state.dropdown_arr[this.state.selector] !== "sandbox"){
                    this.opponentMove(board);
                    // console.log(board);
                }
            }
        })

        // return next_player;
    }

    initGame(player_color) {
        var that = this;
        let original_board = Array(64).fill(0);
        // initialize the board
        original_board[3 * 8 + 3] = 1;
        original_board[3 * 8 + 4] = 2;
        original_board[4 * 8 + 3] = 2;
        original_board[4 * 8 + 4] = 1;

        this.setState ({
            is_player_vs_computer: true,
        });

        if (!player_color && this.state.dropdown_arr[this.state.selector] !== "sandbox") {
            // request opponent to make a move first
            this.opponentMove(original_board).then(function(res) {
                let hint_board = res.slice();

                that.setState({
                    history: [{
                        squares: res,
                    }],
                    latest_squares: hint_board,
                    is_x_next: false,
                    stepNumber: 1,
                })

                that.hintMove(hint_board, false);
            })
        } else {
            let hint_board = original_board.slice();

            this.setState ({
                history: [{
                    squares: original_board,
                }],
                is_x_next: true,
                stepNumber: 0,
                latest_squares: hint_board,
            });

            this.hintMove(hint_board, true)
        }
    }

    //########## Function used to process AI moves ###########//

    opponentMove(squares) {
        const formData = new FormData();
        let boardStr = "";

        for(let i = 0; i < squares.length; i++){
            boardStr += squares[i];
        }

        formData.append('board', boardStr);
        formData.append('color', !this.state.player);
        formData.append('AI_player', this.state.dropdown_arr[this.state.selector]);

        return fetch('http://localhost:8000/api/get_next', {
            method: 'POST',
            body: formData,
        }).then((response) => response.json()).then((responseData) => {
            let board_str = responseData.updated_board
            let board = Array(64).fill(0);
            for(let i = 0; i < board_str.length; i++){
                board[i] = parseInt(board_str[i]);
            }

            this.endMoveWrapper(board, !this.state.player);

            return board;
        })
    }

    //############ Main click handling Functions #############//
    changeOpponent(e) {
        this.setState({
            selector: e
        },() => {
            this.initGame();
        })
    }

    changeSide() {
        var that = this;
        console.log(this.state.player)
        this.setState({
            player: !this.state.player
        },() => {
            that.initGame(this.state.player)
        })
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const squares = history[history.length - 1].squares.slice();
        console.log(history);

        if (squares[i] !== 0 && squares[i] !== 3) {
            this.setState({
                msg: "Invalid move"
            })
            return;
        } else {
            this.setState({
                msg: ""
            })
        }

        const validation_check = this.checkMove(squares, i, this.state.is_x_next)
        console.log(validation_check)

        if (validation_check.move_check) {
            this.makeMove(squares, i, validation_check.direction_checks, this.state.is_x_next);
            this.endMoveWrapper(squares, this.state.is_x_next)
        } else {
            this.setState({
                msg: validation_check.msg
            });
        }

        console.log("end handle click")
    }

    jumpTo (step) {
        const squares = this.state.history[step].squares.slice();
        const valid_next = this.hintMove(squares, (step % 2 === 0));

        this.setState({
            stepNumber: step,
            is_x_next: (step % 2) === 0,
            latest_squares: squares,
        })
    }

    handleButton(name, event) {
        this.setState({[name]: event.target.checked});
    }

    render() {
        const history = this.state.history;
        const score = this.calculateScore(this.state.latest_squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });


        let status;
        let err_msg = this.state.msg;
        if (score.end) {
            status = 'Winner: ' + (score.win === 1 ? '⚫' : '⚪');
            err_msg = "Game already over"
        } else {
            status = 'Next player: ' + (this.state.is_x_next ? '⚫' : '⚪');
        }

        let opponent = this.state.dropdown_arr[this.state.selector];
        let side_info;
        if (this.state.player) {
            side_info = "⚫ Player(" + score.black + ") VS. " + opponent + "(" + score.white + ") ⚪";
        } else {
            side_info = "⚫ " + opponent + "(" + score.black + ") VS. Player(" + score.white + ") ⚪";
        }

        return (
            <div className="game">
                <div className="game-board" style={{width: "50vw", display: "flex", justifyContent: "center", alignItems: "right"}}>
                    <Board
                        squares={this.state.latest_squares}
                        onClick={(i) => this.handleClick(i)}
                        dimension={8}
                        checkedHint = {this.state.checkedHint}
                        is_x_next = {this.state.is_x_next}
                    />
                </div>
                <div className="game-info" style={{width: "50vw"}}>
                    <h4>Match Status</h4>
                    <div style={{marginTop: '20px',}}>{side_info}</div>
                    <div>{status}</div>
                    <div style={{color: 'red',}}>{this.state.msg}</div>

                    <h5 style={{marginTop: "50px"}}>Choose your opponent</h5>

                    <Dropdown>
                        <DropdownButton id="dropdown-item-button" title={opponent} onSelect={(e) => this.changeOpponent(e)}>
                            <Dropdown.Item as="button" eventKey='0'>APS105-smarter</Dropdown.Item>
                            <Dropdown.Item as="button" eventKey='1'>APS105-smartest</Dropdown.Item>
                            <Dropdown.Item as="button" eventKey='2'>sandbox</Dropdown.Item>
                        </DropdownButton>
                    </Dropdown>


                    <div>
                        <Button style={{marginTop: '10px',}} variant="outline-primary" size="sm" onClick={(e) => this.changeSide()}>
                            <Icon.ArrowLeftRight />Switch Side
                        </Button>
                        <Button style={{marginLeft: '10px',marginTop: '10px',}} variant="outline-primary" size="sm" onClick={(e) => this.changeSide()}>
                            <Icon.ArrowCounterclockwise />Restart
                        </Button>
                    </div>

                    <div className='custom-control custom-switch' style={{marginTop: '10px'}}>
                        <input
                            type='checkbox'
                            className='custom-control-input'
                            id='customSwitches'
                            checked={this.state.checkedHint}
                            onChange={(e) => {this.handleButton('checkedHint', e)}}
                            readOnly
                        />
                        <label className='custom-control-label' htmlFor='customSwitches'>
                            Show Next Step Hint
                        </label>
                    </div>


                    {/*<ol>{moves}</ol>*/}
                </div>
            </div>
        );
    }
}

class Index extends React.Component {

    render() {
        return (
        <div className="Index" style={{height: "100%"}}>
            <div className="Title" style={{height:"150px", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "38px"}}>
                <Row style={{width: "100%"}}>
                    <Col md={3} style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                        <Image style={{height: "60px"}} src={logo} fluid/>
                    </Col>
                    <Col md={9} style={{paddingLeft: "10%"}}>
                        APS105 Reversi Interactive Platform
                    </Col>
                </Row>

            </div>
            <div className="Gameboard" style={{margin: "50px", display: "flex", justifyContent: "center", alignItems: "center"}}>
                <Game />
            </div>

            <footer style={{bottom:"10px", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "20px", position: "absolute"}}>
                <div style={{borderTopStyle: "solid", borderWidth: "2px", width: "100%", borderColor: "#CCCCCC"}}>
                    <div style={{display: "flex", justifyContent: "center", alignItems: "center", padding: "20px"}}>
                        &copy; 2021 copyright APS105 Teaching Team, University of Toronto
                    </div>
                </div>

            </footer>
        </div>
    )}

}

// ========================================

ReactDOM.render(
    <Index />,
    document.getElementById('root')
);