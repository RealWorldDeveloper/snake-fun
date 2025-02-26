import React, { useState, useEffect } from "react";
import './GameBoard.css'; // Import the CSS file for animations

const ROWS = 15;
const COLUMNS = 30;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const DIRECTIONS = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
};

function generateFood() {
  return {
    x: Math.floor(Math.random() * COLUMNS),
    y: Math.floor(Math.random() * ROWS),
  };
}

const SnakeGame = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(generateFood());
  const [direction, setDirection] = useState(DIRECTIONS.ArrowRight);
  const [isGameOver, setIsGameOver] = useState(false);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (DIRECTIONS[e.key]) {
        if (
          (e.key === "ArrowUp" && direction !== DIRECTIONS.ArrowDown) ||
          (e.key === "ArrowDown" && direction !== DIRECTIONS.ArrowUp) ||
          (e.key === "ArrowLeft" && direction !== DIRECTIONS.ArrowRight) ||
          (e.key === "ArrowRight" && direction !== DIRECTIONS.ArrowLeft)
        ) {
          setDirection(DIRECTIONS[e.key]);
          switch (e.key) {
            case "ArrowUp":
              setRotation(270);
              break;
            case "ArrowDown":
              setRotation(90);
              break;
            case "ArrowLeft":
              setRotation(180);
              break;
            case "ArrowRight":
              setRotation(0);
              break;
            default:
              break;
          }
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (isGameOver) return;
    const moveSnake = setInterval(() => {
      setSnake((prev) => {
        const newHead = {
          x: prev[0].x + direction.x,
          y: prev[0].y + direction.y,
        };

        if (newHead.x < 0 || newHead.y < 0 || newHead.x >= COLUMNS || newHead.y >= ROWS || prev.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
          setIsGameOver(true);
          return prev;
        }

        const newSnake = [newHead, ...prev];
        if (newHead.x === food.x && newHead.y === food.y) {
          setFood(generateFood());
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    }, 200);
    return () => clearInterval(moveSnake);
  }, [direction, food, isGameOver]);

  return (
    <div className="d-flex flex-column align-items-center mt-4">
      <h1 className="display-4 font-weight-bold">Snake Game</h1>
      {isGameOver && <p className="text-danger">Game Over! Refresh to Restart</p>}
      <div className="d-grid p-4 border border-dark" style={{ gridTemplateColumns: `repeat(${COLUMNS}, 1fr)` }}>
        {[...Array(ROWS)].map((_, row) =>
          [...Array(COLUMNS)].map((_, col) => {
            const isHead = snake[0].x === col && snake[0].y === row;
            const isBody = snake.some((seg, index) => index > 0 && seg.x === col && seg.y === row);
            const isFood = food.x === col && food.y === row;
            return (
              <div
                key={`${row}-${col}`}
                className="d-flex align-items-center justify-content-center"
                style={{ width: '50px', height: '50px' }}
              >
                {isHead && (
                  <img
                    src="/hasina.png"
                    alt="Snake Head"
                    className="img-fluid"
                    style={{ width: '60px', height: '60px', transform: `rotate(${rotation}deg)` }}
                  />
                )}
                {isBody && (
                  <img
                    src="/body.png"
                    alt="Snake Body"
                    className="img-fluid"
                    style={{ width: '60px', height: '60px' }}
                  />
                )}
                {isFood && (
                  <img
                    src="/food.png"
                    alt="Food"
                    className="img-fluid food"
                    style={{ width: '60px', height: '60px' }}
                  />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SnakeGame;

