import React, { useState, useEffect } from "react";
import Modal from 'react-modal'; // Add this import
import './GameBoard.css'; // Import the CSS file for animations
import './ModalStyles.css'; // Import the CSS file for modal styles
import modalImage from '/modal-message.png'
import modalImage2 from '/modal2.png'
import foodSound from '/food.mp3'
import gameOverMusic from '/gameOverMusic.mp3'
import rareImage from '/rare-food.png'
import rareFoodSound from '/rareFood.mp3'
import obstacleImage from '/obstacleFood.png'; // Import the obstacle food image
import obstacleImage2 from '/obstacleFood2.png'; // Import the second obstacle food image
import obstacleImage3 from '/obstacleFood3.png'; // Import the third obstacle food image
import obstacleFood3Sound from '/obstacleFood3.mp3'; // Import the sound for third obstacle food
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
  const [rareFood, setRareFood] = useState(null);
  const [obstacleFoods, setObstacleFoods] = useState([]); // Change to array for multiple obstacle foods
  const [obstacleFoods2, setObstacleFoods2] = useState([]); // Add state for second obstacle foods
  const [obstacleFoods3, setObstacleFoods3] = useState([]); // Add state for third obstacle foods
  const [cellBlocks, setCellBlocks] = useState([]); // Add state for cell blocks
  const [direction, setDirection] = useState(DIRECTIONS.ArrowRight);
  const [isGameOver, setIsGameOver] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [obstacleFoodIntervalId, setObstacleFoodIntervalId] = useState(null); // Add state for obstacle food interval ID
  const [speed, setSpeed] = useState(200); // Add state for snake speed
  const [score, setScore] = useState(0); // Add state for score

  const handleRestart = () => {
    setSnake(INITIAL_SNAKE);
    setFood(generateFood());
    setRareFood(null);
    setObstacleFoods([]);
    setObstacleFoods2([]); // Reset second obstacle foods
    setObstacleFoods3([]); // Reset third obstacle foods
    setCellBlocks([]);
    setDirection(DIRECTIONS.ArrowRight);
    setIsGameOver(false);
    setRotation(0);
    setSpeed(200); // Reset speed
    setScore(0); // Reset score

    // Clear and restart obstacle food interval
    if (obstacleFoodIntervalId) {
      clearInterval(obstacleFoodIntervalId);
    }
    const newObstacleFoodIntervalId = setInterval(() => {
      setObstacleFoods((prevFoods) => {
        const newFoods = [...prevFoods, generateFood()];
        if (newFoods.length > 2) {
          newFoods.shift(); // Ensure only 3 obstacle foods at a time
        }
        return newFoods;
      });
    }, 2000); // Obstacle food appears every 2 seconds
    setObstacleFoodIntervalId(newObstacleFoodIntervalId);
  };

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
    if (isGameOver) {
      return
    }
    const moveSnake = setInterval(() => {
      setSnake((prev) => {
        const newHead = {
          x: prev[0].x + direction.x,
          y: prev[0].y + direction.y,
        };

        if (newHead.x < 0 || newHead.y < 0 || newHead.x >= COLUMNS || newHead.y >= ROWS || prev.some(seg => seg.x === newHead.x && seg.y === newHead.y) || cellBlocks.some((block) => block.x === newHead.x && block.y === newHead.y)) {
          setIsGameOver(true);
          new Audio(gameOverMusic).play();
          return prev;
        }

        const newSnake = [newHead, ...prev];
        if (newHead.x === food.x && newHead.y === food.y) {
          setFood(generateFood());
          new Audio(foodSound).play();
          setScore((prevScore) => prevScore + 1); // Increase score by 1
        } else if (rareFood && newHead.x === rareFood.x && newHead.y === rareFood.y) {
          setRareFood(null);
          new Audio(rareFoodSound).play(); // Play rare food sound
          newSnake.push({ x: prev[prev.length - 1].x, y: prev[prev.length - 1].y });
          newSnake.push({ x: prev[prev.length - 1].x, y: prev[prev.length - 1].y });
          setScore((prevScore) => prevScore + 3); // Increase score by 3
        } else if (obstacleFoods.some(food => food.x === newHead.x && food.y === newHead.y)) {
          setObstacleFoods((prevFoods) => prevFoods.filter(food => food.x !== newHead.x || food.y !== newHead.y));
          setCellBlocks((prevBlocks) => [...prevBlocks, newHead]); // Add new cell block
        } else if (obstacleFoods2.some(food => food.x === newHead.x && food.y === newHead.y)) {
          setObstacleFoods2((prevFoods) => prevFoods.filter(food => food.x !== newHead.x || food.y !== newHead.y));
          newSnake.pop(); // Reduce snake length by 2
          newSnake.pop();
          setScore((prevScore) => Math.max(prevScore - 5, 0)); // Decrease score by 5, minimum 0
        } else if (obstacleFoods3.some(food => food.x === newHead.x && food.y === newHead.y)) {
          setObstacleFoods3((prevFoods) => prevFoods.filter(food => food.x !== newHead.x || food.y !== newHead.y));
          new Audio(obstacleFood3Sound).play(); // Play third obstacle food sound
          setSpeed((prevSpeed) => Math.max(prevSpeed - 20, 50)); // Increase speed, minimum 50ms interval
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    }, speed);
    return () => clearInterval(moveSnake);
  }, [direction, food, rareFood, obstacleFoods, obstacleFoods2, obstacleFoods3, cellBlocks, isGameOver, speed]);

  useEffect(() => {
    const rareFoodInterval = setInterval(() => {
      setRareFood(generateFood());
      const rareFoodTimeout = setTimeout(() => {
        setRareFood(null);
      }, 5000); // Rare food disappears after 10 seconds
      return () => clearTimeout(rareFoodTimeout);
    }, 20000); // Rare food appears every 20 seconds

    return () => clearInterval(rareFoodInterval);
  }, []);

  useEffect(() => {
    const obstacleFoodInterval = setInterval(() => {
      setObstacleFoods((prevFoods) => {
        const newFoods = [...prevFoods, generateFood()];
        if (newFoods.length > 2) {
          newFoods.shift(); // Ensure only 3 obstacle foods at a time
        }
        return newFoods;
      });
    }, 2000); // Obstacle food appears every 2 seconds

    setObstacleFoodIntervalId(obstacleFoodInterval); // Save interval ID to state

    return () => clearInterval(obstacleFoodInterval);
  }, []);

  useEffect(() => {
    const obstacleFood2Interval = setInterval(() => {
      setObstacleFoods2((prevFoods) => {
        const newFoods = [...prevFoods, generateFood()];
        if (newFoods.length > 2) {
          newFoods.shift(); // Ensure only 3 obstacle foods at a time
        }
        return newFoods;
      });
    }, 7000); // Second obstacle food appears every 5 seconds

    return () => clearInterval(obstacleFood2Interval);
  }, []);

  useEffect(() => {
    const obstacleFood3Interval = setInterval(() => {
      setObstacleFoods3((prevFoods) => {
        const newFoods = [...prevFoods, generateFood()];
        if (newFoods.length > 3) {
          newFoods.shift(); // Ensure only 3 obstacle foods at a time
        }
        return newFoods;
      });
    }, 5000); // Third obstacle food appears every 5 seconds

    return () => clearInterval(obstacleFood3Interval);
  }, []);

  return (
    <div className="gameboard d-flex flex-column align-items-center position-relative">
      <div className="d-flex justify-content-between w-100">
                <h2 className=" count text-center">
        <img src="/score.png" alt="Score Icon" style={{ width: '100px', height: '100px'}} />
        : ${score}bn
      </h2>
      <h1 className="display-4 font-weight-bold">Lets Do Some <img src="/start.png" alt="Score Icon" style={{ width: '100px', height: '100px'}} /> </h1>
      </div>
    
      <Modal
        isOpen={isGameOver}
        onRequestClose={handleRestart}
        contentLabel="Game Over"
        className="game-over-modal position-absolute top-50 start-50 translate-middle"
        overlayClassName="game-over-overlay"
      >
        <h2>Game Over!</h2>
        <div className="position-relative">
          <img src={modalImage} alt="Game Over" className="img-fluid"/>
          <img src={modalImage2} alt="Overlay" className="position-absolute" style={{ top: 0, left: 0, width: '200px', height: '200px' }} />
        </div>
        <button onClick={handleRestart} className="btn p-2 mt-4 bg-success text-light">Restart</button>
      </Modal>
      <div className="board d-grid rounded-4" style={{ gridTemplateColumns: `repeat(${COLUMNS}, 1fr)` }}>
        {[...Array(ROWS)].map((_, row) =>
          [...Array(COLUMNS)].map((_, col) => {
            const isHead = snake[0].x === col && snake[0].y === row;
            const isBody = snake.some((seg, index) => index > 0 && seg.x === col && seg.y === row);
            const isFood = food.x === col && food.y === row;
            const isRareFood = rareFood && rareFood.x === col && rareFood.y === row;
            const isObstacleFood = obstacleFoods.some(food => food.x === col && food.y === row);
            const isObstacleFood2 = obstacleFoods2.some(food => food.x === col && food.y === row);
            const isObstacleFood3 = obstacleFoods3.some(food => food.x === col && food.y === row);
            const isCellBlock = cellBlocks.some((block) => block.x === col && block.y === row);
            return (
              <div
                key={`${row}-${col}`}
                className="d-flex align-items-center justify-content-center "
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
                {isRareFood && (
                  <img
                    src={rareImage}
                    alt="Rare Food"
                    className="img-fluid food"
                    style={{ width: '60px', height: '60px' }}
                  />
                )}
                {isObstacleFood && (
                  <img
                    src={obstacleImage}
                    alt="Obstacle Food"
                    className="img-fluid Obstaclefood"
                    style={{ width: '60px', height: '60px' }}
                  />
                )}
                {isObstacleFood2 && (
                  <img
                    src={obstacleImage2}
                    alt="Obstacle Food 2"
                    className="img-fluid Obstaclefood2"
                    style={{ width: '60px', height: '60px' }}
                  />
                )}
                {isObstacleFood3 && (
                  <img
                    src={obstacleImage3}
                    alt="Obstacle Food 3"
                    className="img-fluid Obstaclefood3"
                    style={{ width: '60px', height: '60px' }}
                  />
                )}
                {isCellBlock && (
                  <img
                    src="/cell-block2.png"
                    alt="Cell Block"
                    className="img-fluid"
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

