import React, { useEffect, useState } from "react";
import "../styles/App.css";

const setTicks = () => 0.1;
var ticks = setTicks();

const Timer = ({ time, setTime, stopTimer, setStopTimer }) => {
  useEffect(() => {
    if (!stopTimer) {
      const interval = setInterval(() => {
        setTime(time + 1);
      }, ticks * 1000);
      return () => clearInterval(interval);
    }
  }, [time, stopTimer]);
  return (
    <div>
      <h2>Timer</h2>
      <p>{time}</p>
    </div>
  );
};

let pieces = [
  {
    shape: "O",
    x: Math.floor(Math.random() * (10 - 1)),
    y: 0,
    values: [
      [1, 1],
      [1, 1],
    ],
  },
  {
    shape: "I",
    x: Math.floor(Math.random() * (10 - 0)),
    y: 0,
    values: [[1], [1], [1], [1]],
  },
  {
    shape: "S",
    x: Math.floor(Math.random() * (10 - 2)),
    y: 0,
    values: [
      [0, 1, 1],
      [1, 1, 0],
    ],
  },
  {
    shape: "Z",
    x: Math.floor(Math.random() * (10 - 2)),
    y: 0,
    values: [
      [1, 1, 0],
      [0, 1, 1],
    ],
  },
  {
    shape: "L",
    x: Math.floor(Math.random() * (10 - 1)),
    y: 0,
    values: [
      [1, 0],
      [1, 0],
      [1, 1],
    ],
  },
  {
    shape: "J",
    x: Math.floor(Math.random() * (10 - 1)),
    y: 0,
    values: [
      [0, 1],
      [0, 1],
      [1, 1],
    ],
  },
  {
    shape: "T",
    x: Math.floor(Math.random() * (10 - 2)),
    y: 0,
    values: [
      [1, 1, 1],
      [0, 1, 0],
    ],
  },
];

const TetrisBoard = ({ board, setBoard, time, setStopTimer }) => {
  const [score, setScore] = useState(0);
  const [displayBoard, setDisplayBoard] = useState(
    JSON.parse(JSON.stringify(board))
  );
  const [currentPiece, setCurrentPiece] = useState(
    JSON.parse(
      JSON.stringify(pieces[Math.floor(Math.random() * pieces.length)])
    )
  );

  const checkCollision = (currentPiece, board) => {
    const { x, y, values } = currentPiece;
    for (let i = 0; i < values.length; i++) {
      for (let j = 0; j < values[i].length; j++) {
        if (values[i][j] !== 0) {
          if (
            board[y + i] === undefined ||
            board[y + i][x + j] === undefined ||
            board[y + i][x + j] !== 0
          ) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const movementHandler = (e) => {
    e.preventDefault();
    if (e.key === "ArrowLeft") {
      moveLeft();
    } else if (e.key === "ArrowRight") {
      moveRight();
    }
  };

  const moveLeft = () => {
    const newPiece = { ...currentPiece };
    newPiece.x--;
    if (!checkCollision(newPiece, board)) {
      console.log("left");
      setCurrentPiece(newPiece);
    }
  };

  const moveRight = () => {
    const newPiece = { ...currentPiece };
    newPiece.x++;
    if (!checkCollision(newPiece, board)) {
      console.log("right");
      setCurrentPiece(newPiece);
    }
  };

  const renderPiece = (piece, board) => {
    let newBoard = JSON.parse(JSON.stringify(board));
    const { x, y, values } = piece;
    for (let i = 0; i < values.length; i++) {
      for (let j = 0; j < values[i].length; j++) {
        if (values[i][j] !== 0) {
          newBoard[y + i][x + j] = values[i][j];
        }
      }
    }
    return newBoard;
  };

  const checkLose = (board) => {
    for (let j = 0; j < board[0].length; j++) {
      if (board[0][j] === 1) {
        return true;
      }
    }

    return false;
  };

  useEffect(() => {
    let newBoard = JSON.parse(JSON.stringify(board));
    let turnScore = 0;
    for (let i = 0; i < newBoard.length; i++) {
      let isRowFilled = true;
      for (let j = 0; j < newBoard[i].length; j++) {
        if (board[i][j] === 0) {
          isRowFilled = false;
        }
      }
      if (isRowFilled) {
        board.splice(i, 1);
        board.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        turnScore += 10;
      }
    }
    setScore(score + turnScore);
  }, [board]);

  useEffect(() => {
    if (checkLose(board)) {
      setDisplayBoard(renderPiece(currentPiece, board));
      // alert("You lose!");
      setStopTimer(true);
    } else {
      if (time <= 1) {
        setDisplayBoard(renderPiece(currentPiece, board));
      }
      let newPiece = { ...currentPiece, y: currentPiece.y + 1 };
      if (checkCollision(newPiece, board)) {
        console.log("collision");
        setBoard(renderPiece(currentPiece, board));
        setCurrentPiece(
          JSON.parse(
            JSON.stringify(pieces[Math.floor(Math.random() * pieces.length)])
          )
        );
      } else {
        setCurrentPiece(newPiece);
        console.log(newPiece.x);
        setDisplayBoard(renderPiece(newPiece, board));
      }
    }
  }, [time]);

  return (
    <>
      <div>
        <h2>Score</h2>
        <p id="score">{score}</p>
      </div>
      <div id="tetris-board" tabIndex="0" onKeyDown={movementHandler}>
        <table>
          <tbody>
            {displayBoard.map((row, rowIndex) => {
              return (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => {
                    return (
                      <td key={cellIndex}>
                        <div
                          className={`cell ${cell == 1 ? "filled" : ""}`}
                        ></div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

const App = () => {
  const [board, setBoard] = useState([]);
  const [time, setTime] = useState(0);
  const [stopTimer, setStopTimer] = useState(false);
  useEffect(() => {
    setBoard(() => {
      const board = [];
      for (let i = 0; i < 20; i++) {
        board.push(Array(10).fill(0));
      }
      return board;
    });
  }, []);
  return (
    <div id="main">
      <h1>Tetris Game</h1>
      {board.length > 0 && (
        <>
          <Timer
            time={time}
            setTime={setTime}
            stopTimer={stopTimer}
            setStopTimer={setStopTimer}
          />
          <TetrisBoard
            board={board}
            setBoard={setBoard}
            time={time}
            setStopTimer={setStopTimer}
          />
        </>
      )}
    </div>
  );
};

export default App;
