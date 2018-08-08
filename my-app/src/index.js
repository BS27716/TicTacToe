import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

function calculateWinner(squares) {
    const lines = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a,b,c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

class Board extends React.Component {
    renderSquare(i) {
        return <Square value={this.props.squares[i]} onClick={() => this.props.onClick(i)}/>;
    }
    
    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null)
            }],
            xIsNext: true,
            stepNumber: 0,
            click_row: [{row: 0}],
            click_col: [{column: 0}]
        };
    }

    jumpTo(step)
    {
        this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0
        });
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length-1];
        const squares = current.squares.slice();
        const click_row = this.state.click_row;
        const click_col = this.state.click_col;

        let row;
        let column;
        if (i === 0 || i === 1 || i === 2)
        {
            row = 1;
            column = i + 1;
        }
        if (i === 3 || i === 4 || i === 5)
        {
            row = 2;
            column = i - 2;
        }
        if (i === 6 || i === 7 || i === 8)
        {
            row = 3;
            column = i - 5;
        }


        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{squares: squares}]), 
            stepNumber: history.length, 
            xIsNext: !this.state.xIsNext,
            click_row: click_row.concat([{row: row}]), 
            click_col: click_col.concat([{column: column}])
        });
    }

    render() {
        const history = this.state.history;
        const stepNumber = this.state.stepNumber;
        const current = history[stepNumber];
        const winner = calculateWinner(current.squares);
        const row = this.state.click_row.row[stepNumber];
        const col = this.state.click_col.column[stepNumber];

        const moves = history.map((step, move) => {
            const desc = move ? 'Go to move #' + move + ', row:' + row + ', col:' + col : 'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winner) 
        {
            status = 'Winner: ' + winner;
        } 
        else 
        {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <h1 className="heading">TIC TAC TIZZOE</h1>
                <h5 className="heading">by Brandon Shipman</h5>
                <div className="game-board">
                    <Board squares={current.squares} onClick={i => this.handleClick(i)}/>
                </div>
                <div className="game-info">
                    <div className="status">{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// =========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);