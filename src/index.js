import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Switch from '@bit/mui-org.material-ui.switch';
import FormControlLabel from '@bit/mui-org.material-ui.form-control-label';


function Square(props) {
    const chess = props.value === 1 ? '●': (props.value === 2 ? '○' : '');

    if (props.checkedHint && props.value === 3) {
        console.log(props)

        return (
            <button style={{color: "orange"}} className="square" onClick={props.onClick}>
                {props.is_x_next ? '●': '○'}
            </button>
        );
    } else {
        return (
            <button className="square" onClick={props.onClick}>
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
        original_board[3 * 8 + 3] = 1;
        original_board[3 * 8 + 4] = 2;
        original_board[4 * 8 + 3] = 2;
        original_board[4 * 8 + 4] = 1;

        this.state = {
            history: [{
                squares: original_board
            }],
            is_x_next: true,
            stepNumber: 0,
            checkedHint: false,
            latest_squares: original_board,
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
        if (board[i]) {
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

    //############ Main click handling Functions #############//
    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const squares = history[history.length - 1].squares.slice();
        console.log(history);

        if (calculateWinner(squares) || squares[i]) {
            this.setState({
                msg: "Invalid move"
            })
            return;
        }

        const validation_check = this.checkMove(squares, i, this.state.is_x_next);

        if (validation_check.move_check) {
            this.makeMove(squares, i, validation_check.direction_checks, this.state.is_x_next);
            let hint_board = squares.slice();
            const valid_next = this.hintMove(hint_board, !this.state.is_x_next);

            console.log(hint_board)

            this.setState({
                history: history.concat([{
                    squares: squares
                }]),
                latest_squares: hint_board,
                stepNumber: history.length,
                msg: "",
            });
            if (valid_next){
                this.setState({
                    is_x_next: !this.state.is_x_next,
                });
            }
            console.log(this.state.history)
        } else {
            this.setState({
                msg: validation_check.msg
            });
        }
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
        console.log(event);
        this.setState({[name]: event.target.checked});
    }

    render() {
        const history = this.state.history;
        const winner = calculateWinner(this.state.latest_squares);

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
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.is_x_next ? '●' : '○');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={this.state.latest_squares}
                        onClick={(i) => this.handleClick(i)}
                        dimension={8}
                        checkedHint = {this.state.checkedHint}
                        is_x_next = {this.state.is_x_next}
                    />
                </div>
                <div className="game-info">
                    <FormControlLabel
                        control={
                            <Switch checked={this.state.checkedHint}
                                    onChange={(e) => {this.handleButton('checkedHint', e)}}
                                    value="Show Next Step Hint"
                                    color="primary" />
                        }
                        label="Show Next Step Hint"
                    />
                    <div>{status}</div>
                    <div style={{color: 'red',}}>{this.state.msg}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinner(squares) {
    // const lines = [
    //     [0, 1, 2],
    //     [3, 4, 5],
    //     [6, 7, 8],
    //     [0, 3, 6],
    //     [1, 4, 7],
    //     [2, 5, 8],
    //     [0, 4, 8],
    //     [2, 4, 6],
    // ];
    // for (let i = 0; i < lines.length; i++) {
    //     const [a, b, c] = lines[i];
    //     if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
    //         return squares[a];
    //     }
    // }
    return null;
}
