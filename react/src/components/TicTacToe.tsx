import { useState } from "react";
import { TicTacToeSquare } from "./TicTacToeSquare";

export function TicTacToe() {
    const [xIsNext, setXIsNext] = useState(true)
    const [squares, setSquares] = useState<(string | null)[]>(Array(9).fill(null))

    function handleClick(i: number) {
        if (squares[i] || calculateWinner(squares)) return;
        
        const nextSquares = squares.slice();
        nextSquares[i] = xIsNext ? "X" : "O";
        setSquares(nextSquares);
        setXIsNext(!xIsNext);
    }

    const winner = calculateWinner(squares);
    const status = winner ? winner + " a gagné" : "Prochain tour : " + (xIsNext ? "X" : "O");

    return (
        <>
        <div className="status">{status}</div>
        <div className="board">
            <div className="board-row">
                <TicTacToeSquare value={squares[0]} onSquareClick={() => handleClick(0)} />
                <TicTacToeSquare value={squares[1]} onSquareClick={() => handleClick(1)} />
                <TicTacToeSquare value={squares[2]} onSquareClick={() => handleClick(2)} />
            </div>
            <div className="board-row">
                <TicTacToeSquare value={squares[3]} onSquareClick={() => handleClick(3)} />
                <TicTacToeSquare value={squares[4]} onSquareClick={() => handleClick(4)} />
                <TicTacToeSquare value={squares[5]} onSquareClick={() => handleClick(5)} />
            </div>
            <div className="board-row">
                <TicTacToeSquare value={squares[6]} onSquareClick={() => handleClick(6)} />
                <TicTacToeSquare value={squares[7]} onSquareClick={() => handleClick(7)} />
                <TicTacToeSquare value={squares[8]} onSquareClick={() => handleClick(8)} />
            </div>
        </div>
        </>
    )
}

function calculateWinner(squares: (string | null)[]): string | null {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (const line in lines) {
    const [a, b, c] = lines[line];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
