import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        //passing the function a the onClick prop
        <button 
            className="square" 
            //When a Square is clicked, the onClick function provided by the Board is called
            onClick={props.onClick}
            >
                {props.value}
        </button>
    );
}
    
class Board extends React.Component {

    //Boards initial stte contains arry OF 9 NULLS CORRECSPONDING TO THE 9 SQUARES
        renderSquare(i) {
        return (
        <Square 
            value={this.props.squares[i]}
            //we’ll pass down a function from the Board to the Square, and we’ll have Square call that function when a square is clicked.
            onClick={() => this.props.onClick(i)}
        />
        );
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
                squares: Array(9).fill(null),
            }],
            stepNumber:0,
            xIsNext: true,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber +1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();        // function to return early by ignoring a click if someone has won the game or if a Square is already filled
        if (calculateWinner(squares) || squares[i]) {
            //if no return value is specified, the function will return undefined 
            return;
        }
        
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([
              {
                squares: squares
              }
            ]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
          });
        }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) ===0,
        });
    }
    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
        const desc = move ? 
        'Go to move #' + move :
        'Go to game start';
        return (
            // Keys tell React about the identity of each component which allows React to maintain state between re-renders.
            // If a component’s key changes, the component will be destroyed and re-created with a new state.
            //The moves are never re-ordered, deleted, or inserted in the middle, so it’s safe to use the move index as a key.
            <li key={move}>
                <button onClick={() => this.jumpTo(move)}>{desc}</button>
            </li>
        );
        });
        
        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status= 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board 
                    squares={current.squares}
                    onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }
// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
