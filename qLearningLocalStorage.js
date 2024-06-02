document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    let squares = Array.from(document.querySelectorAll('.grid div'));
    const scoreDisplay = document.querySelector('#score');
    const startBtn = document.querySelector('#start-button');
    const width = 10;
    let nextRandom = 0;
    let timerId;
    let score = 0;
    const colors = ['orange', 'red', 'purple', 'yellow', 'blue'];
  
    const lBlock = [
      [1, width + 1, width * 2 + 1, 2],
      [width, width + 1, width + 2, width * 2 + 2],
      [1, width + 1, width * 2 + 1, width * 2],
      [width, width * 2, width * 2 + 1, width * 2 + 2]
    ];
  
    const zBlock = [
      [0, width, width + 1, width * 2 + 1],
      [width + 1, width + 2, width * 2, width * 2 + 1],
      [0, width, width + 1, width * 2 + 1],
      [width + 1, width + 2, width * 2, width * 2 + 1]
    ];
  
    const tBlock = [
      [1, width, width + 1, width + 2],
      [1, width + 1, width + 2, width * 2 + 1],
      [width, width + 1, width + 2, width * 2 + 1],
      [1, width, width + 1, width * 2 + 1]
    ];
  
    const oBlock = [
      [0, 1, width, width + 1],
      [0, 1, width, width + 1],
      [0, 1, width, width + 1],
      [0, 1, width, width + 1]
    ];
  
    const iBlock = [
      [1, width + 1, width * 2 + 1, width * 3 + 1],
      [width, width + 1, width + 2, width + 3],
      [1, width + 1, width * 2 + 1, width * 3 + 1],
      [width, width + 1, width + 2, width + 3]
    ];
  
    const theBlocks = [lBlock, zBlock, tBlock, oBlock, iBlock];
  
    let currentPosition = 4;
    let currentRotation = 0;
    let random = Math.floor(Math.random() * theBlocks.length);
    let current = theBlocks[random][currentRotation];
  
    function draw() {
      current.forEach(index => {
        squares[currentPosition + index].classList.add('tetromino');
        squares[currentPosition + index].style.backgroundColor = colors[random];
      });
    }
  
    function undraw() {
      current.forEach(index => {
        squares[currentPosition + index].classList.remove('tetromino');
        squares[currentPosition + index].style.backgroundColor = '';
      });
    }
  
    function control() {
      const state = getState();
      const action = chooseAction(state);
      if (action === 'left') moveLeft();
      else if (action === 'right') moveRight();
      else if (action === 'rotate') rotate();
      else if (action === 'down') moveDown();
      const reward = getReward();
      const nextState = getState();
      updateQTable(state, action, reward, nextState);
    }
  
    function moveDown() {
      undraw();
      currentPosition += width;
      draw();
      freeze();
    }
  
    function freeze() {
      if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
        current.forEach(index => squares[currentPosition + index].classList.add('taken'));
        random = nextRandom;
        nextRandom = Math.floor(Math.random() * theBlocks.length);
        current = theBlocks[random][currentRotation];
        currentPosition = 4;
        draw();
        displayShape();
        addScore();
        if (gameOver()) {
          scoreDisplay.innerHTML = 'end';
          clearInterval(timerId);
        }
      }
    }
  
    function moveLeft() {
      undraw();
      const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
      if (!isAtLeftEdge) currentPosition -= 1;
      if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition += 1;
      }
      draw();
    }
  
    function moveRight() {
      undraw();
      const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);
      if (!isAtRightEdge) currentPosition += 1;
      if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition -= 1;
      }
      draw();
    }
  
    function rotate() {
      undraw();
      currentRotation++;
      if (currentRotation === current.length) {
        currentRotation = 0;
      }
      current = theBlocks[random][currentRotation];
      checkRotatedPosition();
      draw();
    }
  
    function isAtRight() {
      return current.some(index => (currentPosition + index + 1) % width === 0);
    }
  
    function isAtLeft() {
      return current.some(index => (currentPosition + index) % width === 0);
    }
  
    function checkRotatedPosition(P) {
      P = P || currentPosition;
      if ((P + 1) % width < 4) {
        if (isAtRight()) {
          currentPosition += 1;
          checkRotatedPosition(P);
        }
      } else if (P % width > 5) {
        if (isAtLeft()) {
          currentPosition -= 1;
          checkRotatedPosition(P);
        }
      }
    }

    //score metrics
    let totalGames = 0;
    let totalScore = 0;
    let maxScore = 0;
    let linesCleared = 0;
    const scores = [];
    const linesClearedPerGame = [];


  
    const displaySquares = document.querySelectorAll('.mini-grid div');
    const displayWidth = 4;
    const displayIndex = 0;
  
    const upNextTetrominoes = [
      [1, displayWidth + 1, displayWidth * 2 + 1, 2],
      [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1],
      [1, displayWidth, displayWidth + 1, displayWidth + 2],
      [0, 1, displayWidth, displayWidth + 1],
      [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1]
    ];
  
    function displayShape() {
      displaySquares.forEach(square => {
        square.classList.remove('tetromino');
        square.style.backgroundColor = '';
      });
      upNextTetrominoes[nextRandom].forEach(index => {
        displaySquares[displayIndex + index].classList.add('tetromino');
        displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom];
      });
    }
  
    function addScore() {
      for (let i = 0; i < 199; i += width) {
        const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];
        if (row.every(index => squares[index].classList.contains('taken'))) {
          score += 10;
          scoreDisplay.innerHTML = score;
          row.forEach(index => {
            squares[index].classList.remove('taken');
            squares[index].classList.remove('tetromino');
            squares[index].style.backgroundColor = '';
          });
          const squaresRemoved = squares.splice(i, width);
          squares = squaresRemoved.concat(squares);
          squares.forEach(cell => grid.appendChild(cell));
        }
      }
    }
    
    // function gameOver() {
    //   if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
    //     scoreDisplay.innerHTML = 'end';
    //     clearInterval(timerId);
    //     return true;
    //   }
    //   return false;
    // }
    function updateChart() {
        const ctx = document.getElementById('myChart').getContext('2d');
        const chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: Array.from({length: totalGames}, (_, i) => i + 1),
            datasets: [{
              label: 'Score',
              data: scores,
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
              fill: false
            }, {
              label: 'Lines Cleared',
              data: linesClearedPerGame,
              borderColor: 'rgba(153, 102, 255, 1)',
              borderWidth: 1,
              fill: false
            }]
          },
          options: {
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Game Number'
                }
              },
              y: {
                title: {
                  display: true,
                  text: 'Score/Lines Cleared'
                },
                beginAtZero: true
              }
            }
          }
        });
      }
      function startNewGame() {
        // Initialize a new game
        draw();
        timerId = setInterval(moveDown, 70);
        nextRandom = Math.floor(Math.random() * theBlocks.length);
        displayShape();
      }
      
      function gameOver() {
        console.log('Game Over'); // Check if gameOver function is called
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
          scoreDisplay.innerHTML = 'end';
          clearInterval(timerId);
      
          // Log metrics
          totalGames++;
          totalScore += score;
          if (score > maxScore) {
            maxScore = score;
          }
          scores.push(score);
          linesClearedPerGame.push(linesCleared);
      
          // Update chart
          updateChart();
      
          // Reset for next game
          score = 0;
          linesCleared = 0;
          startNewGame(); // Start a new game automatically
        }
      }
      
      
      startBtn.addEventListener('click', () => {
        if (timerId) {
          clearInterval(timerId);
          timerId = null;
        } else {
          startNewGame(); // Start a new game when button is clicked
        }
      });
      
  
    const alpha = 0.1;
    const gamma = 0.9;
    const epsilon = 0.1;
    let qTable = {};
  
    function getState() {
      return {
        grid: squares.map(square => square.classList.contains('taken')),
        piece: { current, currentPosition, currentRotation }
      };
    }
  
    function chooseAction(state) {
      if (Math.random() < epsilon) {
        const actions = ['left', 'right', 'rotate', 'down'];
        return actions[Math.floor(Math.random() * actions.length)];
      } else {
        const stateStr = JSON.stringify(state);
        if (!qTable[stateStr]) return 'down';
        const actions = Object.keys(qTable[stateStr]);
        return actions.reduce((a, b) => qTable[stateStr][a] > qTable[stateStr][b] ? a : b);
      }
    }
  
    function updateQTable(state, action, reward, nextState) {
      const stateStr = JSON.stringify(state);
      const nextStateStr = JSON.stringify(nextState);
      if (!qTable[stateStr]) qTable[stateStr] = {};
      if (!qTable[nextStateStr]) qTable[nextStateStr] = {};
      if (!qTable[stateStr][action]) qTable[stateStr][action] = 0;
      const maxNextQ = Math.max(...Object.values(qTable[nextStateStr]));
      qTable[stateStr][action] += alpha * (reward + gamma * maxNextQ - qTable[stateStr][action]);
    }
  
    function getReward() {
      let reward = -1;
      for (let i = 0; i < 199; i += width) {
        const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];
        if (row.every(index => squares[index].classList.contains('taken'))) {
          reward += 10;
        }
      }
      if (gameOver()) reward -= 100;
      return reward;
    }
  
    // Optional: Load and save Q-table for persistence between sessions
    function saveQTable() {
      localStorage.setItem('qTable', JSON.stringify(qTable));
    }
  
    function loadQTable() {
      const storedQTable = localStorage.getItem('qTable');
      if (storedQTable) {
        qTable = JSON.parse(storedQTable);
      }
    }
  
    // Load Q-table on page load
    loadQTable();
  
    // Save Q-table periodically
    setInterval(saveQTable, 5000);
  });
  