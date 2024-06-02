// import { getBestMove } from './botlogic.js';

// document.addEventListener('DOMContentLoaded', () => {
//     const grid = document.querySelector('.grid');
//     const miniGrid = document.querySelector('.mini-grid');
//     const scoreDisplay = document.querySelector('#score');
//     const startBtn = document.querySelector('#start-button');
//     const width = 10;
//     let timerId;
//     let score = 0;
//     const colors = ['orange', 'red', 'purple', 'yellow', 'blue'];
  
//     // Create the main grid and mini grid
//     grid.innerHTML = Array.from({ length: 200 }, () => '<div></div>').join('') +
//                      Array.from({ length: 10 }, () => '<div class="taken"></div>').join('');
//     miniGrid.innerHTML = Array.from({ length: 16 }, () => '<div></div>').join('');
  
//     let squares = Array.from(document.querySelectorAll('.grid div'));
//     const displaySquares = document.querySelectorAll('.mini-grid div');
//     const upNextTetrominoes = [
//       [1, width+1, width*2+1, 2], // lBlock
//       [0, width, width+1, width*2+1], // zBlock
//       [1, width, width+1, width+2], // tBlock
//       [0, 1, width, width+1], // oBlock
//       [1, width+1, width*2+1, width*3+1] // iBlock
//     ];
  
//     const lBlock = [
//       [1, width+1, width*2+1, 2],
//       [width, width+1, width+2, width*2+2],
//       [1, width+1, width*2+1, width*2],
//       [width, width*2, width*2+1, width*2+2]
//     ];
  
//     const zBlock = [
//       [0, width, width+1, width*2+1],
//       [width+1, width+2, width*2, width*2+1],
//       [0, width, width+1, width*2+1],
//       [width+1, width+2, width*2, width*2+1]
//     ];
  
//     const tBlock = [
//       [1, width, width+1, width+2],
//       [1, width+1, width+2, width*2+1],
//       [width, width+1, width+2, width*2+1],
//       [1, width, width+1, width*2+1]
//     ];
  
//     const oBlock = [
//       [0, 1, width, width+1],
//       [0, 1, width, width+1],
//       [0, 1, width, width+1],
//       [0, 1, width, width+1]
//     ];
  
//     const iBlock = [
//       [1, width+1, width*2+1, width*3+1],
//       [width, width+1, width+2, width+3],
//       [1, width+1, width*2+1, width*3+1],
//       [width, width+1, width+2, width+3]
//     ];
  
//     const theBlocks = [lBlock, zBlock, tBlock, oBlock, iBlock];
  
//     let currentPosition = 4;
//     let currentRotation = 0;
//     let random = Math.floor(Math.random() * theBlocks.length);
//     let current = theBlocks[random][currentRotation];
  
//     // Draw the Tetromino
//     function draw() {
//       current.forEach(index => {
//         squares[currentPosition + index].classList.add('tetromino');
//         squares[currentPosition + index].style.backgroundColor = colors[random];
//       });
//     }
  
//     // Undraw the Tetromino
//     function undraw() {
//       current.forEach(index => {
//         squares[currentPosition + index].classList.remove('tetromino');
//         squares[currentPosition + index].style.backgroundColor = '';
//       });
//     }
  
//     // Move the Tetromino down
//     function moveDown() {
//       undraw();
//       currentPosition += width;
//       draw();
//       freeze();
//     }
  
//     // Freeze the Tetromino
//     function freeze() {
//       if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
//         current.forEach(index => squares[currentPosition + index].classList.add('taken'));
//         // Start a new Tetromino falling
//         random = nextRandom;
//         nextRandom = Math.floor(Math.random() * theBlocks.length);
//         current = theBlocks[random][currentRotation];
//         currentPosition = 4;
//         draw();
//         displayShape();
//         addScore();
//         gameOver();
//       }
//     }
  
//     // Move the Tetromino left, unless at the edge or there is a blockage
//     function moveLeft() {
//       undraw();
//       const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
//       if (!isAtLeftEdge) currentPosition -= 1;
//       if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
//         currentPosition += 1;
//       }
//       draw();
//     }
  
//     // Move the Tetromino right, unless at the edge or there is a blockage
//     function moveRight() {
//       undraw();
//       const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);
//       if (!isAtRightEdge) currentPosition += 1;
//       if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
//         currentPosition -= 1;
//       }
//       draw();
//     }
  
//     // Rotate the Tetromino
//     function rotate() {
//       undraw();
//       currentRotation++;
//       if (currentRotation === current.length) {
//         currentRotation = 0;
//       }
//       current = theBlocks[random][currentRotation];
//       draw();
//     }
  
//     // Show the next Tetromino in the mini-grid display
//     function displayShape() {
//       displaySquares.forEach(square => {
//         square.classList.remove('tetromino');
//         square.style.backgroundColor = '';
//       });
//       upNextTetrominoes[nextRandom].forEach(index => {
//         displaySquares[displayIndex + index].classList.add('tetromino');
//         displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom];
//       });
//     }
  
//     // Add functionality to the button
//     startBtn.addEventListener('click', () => {
//       if (timerId) {
//         clearInterval(timerId);
//         timerId = null;
//       } else {
//         draw();
//         timerId = setInterval(moveDown, 1000);
//         nextRandom = Math.floor(Math.random() * theBlocks.length);
//         displayShape();
//       }
//     });
  
//     // Add score
//     function addScore() {
//       for (let i = 0; i < 199; i += width) {
//         const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];
//         if (row.every(index => squares[index].classList.contains('taken'))) {
//           score += 10;
//           scoreDisplay.innerHTML = score;
//           row.forEach(index => {
//             squares[index].classList.remove('taken');
//             squares[index].classList.remove('tetromino');
//             squares[index].style.backgroundColor = '';
//           });
//           const squaresRemoved = squares.splice(i, width);
//           squares = squaresRemoved.concat(squares);
//           squares.forEach(cell => grid.appendChild(cell));
//         }
//       }
//     }
  
//     // Game Over
//     function gameOver() {
//       if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
//         scoreDisplay.innerHTML = 'end';
//         clearInterval(timerId);
//       }
//     }
  
//     // Event listener for key controls
//     document.addEventListener('keydown', control);
  
//     function control(e) {
//       if (e.keyCode === 37) {
//         moveLeft();
//       } else if (e.keyCode === 38) {
//         rotate();
//       } else if (e.keyCode === 39) {
//         moveRight();
//       } else if (e.keyCode === 40) {
//         moveDown();
//       }
//     }
//   });




// // import { getBestMove } from './botlogic.js';

// // document.addEventListener('DOMContentLoaded', () => {
// //     const grid = document.querySelector('.grid');
// //     const miniGrid = document.querySelector('.mini-grid');
// //     const scoreDisplay = document.querySelector('#score');
// //     const startBtn = document.querySelector('#start-button');
// //     const width = 10;
// //     let timerId;
// //     let score = 0;
// //     const colors = ['orange', 'red', 'purple', 'yellow', 'blue'];

// //     // Create the main grid and mini grid
// //     grid.innerHTML = Array.from({ length: 200 }, () => '<div></div>').join('') +
// //                      Array.from({ length: 10 }, () => '<div class="taken"></div>').join('');
// //     miniGrid.innerHTML = Array.from({ length: 16 }, () => '<div></div>').join('');

// //     let squares = Array.from(document.querySelectorAll('.grid div'));
// //     const displaySquares = document.querySelectorAll('.mini-grid div');
// //     const upNextTetrominoes = [
// //       [1, width+1, width*2+1, 2], // lBlock
// //       [0, width, width+1, width*2+1], // zBlock
// //       [1, width, width+1, width+2], // tBlock
// //       [0, 1, width, width+1], // oBlock
// //       [1, width+1, width*2+1, width*3+1] // iBlock
// //     ];

// //     // Tetromino shapes
// //     const lBlock = [
// //       [1, width+1, width*2+1, 2],
// //       [width, width+1, width+2, width*2+2],
// //       [1, width+1, width*2+1, width*2],
// //       [width, width*2, width*2+1, width*2+2]
// //     ];

// //     const zBlock = [
// //       [0, width, width+1, width*2+1],
// //       [width+1, width+2, width*2, width*2+1],
// //       [0, width, width+1, width*2+1],
// //       [width+1, width+2, width*2, width*2+1]
// //     ];

// //     const tBlock = [
// //       [1, width, width+1, width+2],
// //       [1, width+1, width+2, width*2+1],
// //       [width, width+1, width+2, width*2+1],
// //       [1, width, width+1, width*2+1]
// //     ];

// //     const oBlock = [
// //       [0, 1, width, width+1],
// //       [0, 1, width, width+1],
// //       [0, 1, width, width+1],
// //       [0, 1, width, width+1]
// //     ];

// //     const iBlock = [
// //       [1, width+1, width*2+1, width*3+1],
// //       [width, width+1, width+2, width+3],
// //       [1, width+1, width*2+1, width*3+1],
// //       [width, width+1, width+2, width+3]
// //     ];

// //     const theBlocks = [lBlock, zBlock, tBlock, oBlock, iBlock];

// //     let currentPosition = 4;
// //     let currentRotation = 0;
// //     let random = Math.floor(Math.random() * theBlocks.length);
// //     let current = theBlocks[random][currentRotation];

// //     // Draw the Tetromino
// //     function draw() {
// //       current.forEach(index => {
// //         squares[currentPosition + index].classList.add('tetromino');
// //         squares[currentPosition + index].style.backgroundColor = colors[random];
// //       });
// //     }

// //     // Undraw the Tetromino
// //     function undraw() {
// //       current.forEach(index => {
// //         squares[currentPosition + index].classList.remove('tetromino');
// //         squares[currentPosition + index].style.backgroundColor = '';
// //       });
// //     }

// //     // Move the Tetromino down
// //     function moveDown() {
// //       undraw();
// //       currentPosition += width;
// //       draw();
// //       freeze();
// //     }

// //     // Freeze the Tetromino
// //     function freeze() {
// //       if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
// //         current.forEach(index => squares[currentPosition + index].classList.add('taken'));
// //         // Start a new Tetromino falling
// //         random = nextRandom;
// //         nextRandom = Math.floor(Math.random() * theBlocks.length);
// //         current = theBlocks[random][currentRotation];
// //         currentPosition = 4;
// //         draw();
// //         displayShape();
// //         addScore();
// //         gameOver();
// //       }
// //     }

// //     // Move the Tetromino left, unless at the edge or there is a blockage
// //     function moveLeft() {
// //       undraw();
// //       const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
// //       if (!isAtLeftEdge) currentPosition -= 1;
// //       if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
// //         currentPosition += 1;
// //       }
// //       draw();
// //     }

// //     // Move the Tetromino right, unless at the edge or there is a blockage
// //     function moveRight() {
// //       undraw();
// //       const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);
// //       if (!isAtRightEdge) currentPosition += 1;
// //       if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
// //         currentPosition -= 1;
// //       }
// //       draw();
// //     }

// //     // Rotate the Tetromino
// //     function rotate() {
// //       undraw();
// //       currentRotation++;
// //       if (currentRotation === current.length) {
// //         currentRotation = 0;
// //       }
// //       current = theBlocks[random][currentRotation];
// //       draw();
// //     }

// //     // Show the next Tetromino in the mini-grid display
// //     function displayShape() {
// //       displaySquares.forEach(square => {
// //         square.classList.remove('tetromino');
// //         square.style.backgroundColor = '';
// //       });
// //       upNextTetrominoes[nextRandom].forEach(index => {
// //         displaySquares[displayIndex + index].classList.add('tetromino');
// //         displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom];
// //       });
// //     }

// //     // Add functionality to the button
// //     startBtn.addEventListener('click', () => {
// //       if (timerId) {
// //         clearInterval(timerId);
// //         timerId = null;
// //       } else {
// //         draw();
// //         timerId = setInterval(moveDown, 1000);
// //         nextRandom = Math.floor(Math.random() * theBlocks.length);
// //         displayShape();
// //       }
// //     });

// //     // Add score
// //     // Add score
// // function addScore() {
// //     for (let i = 0; i < 199; i += width) {
// //       const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];
// //       if (row.every(index => squares[index].classList.contains('taken'))) {
// //         score += 10;
// //         scoreDisplay.innerHTML = score;
// //         row.forEach(index => {
// //           squares[index].classList.remove('taken');
// //           squares[index].classList.remove('tetromino');
// //           squares[index].style.backgroundColor = '';
// //         });
// //         const squaresRemoved = squares.splice(i, width);
// //         squares = squaresRemoved.concat(squares);
// //         squares.forEach(cell => grid.appendChild(cell));
// //       }
// //     }
// //   }
  
// //   // Game Over
// //   function gameOver() {
// //     if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
// //       scoreDisplay.innerHTML = 'end';
// //       clearInterval(timerId);
// //     }
// //   }
  
// //   // Event listener for key controls
// //   document.addEventListener('keydown', control);
  
// //   function control(e) {
// //     if (e.keyCode === 37) {
// //       moveLeft();
// //     } else if (e.keyCode === 38) {
// //       rotate();
// //     } else if (e.keyCode === 39) {
// //       moveRight();
// //     } else if (e.keyCode === 40) {
// //       moveDown();
// //     }
// //   }
  
// //   // Event listener for the start button (already implemented)
  
// //   });
// //     // Add functionality to the button
// // startBtn.addEventListener('click', () => {
// //     console.log('Start button clicked'); // Debugging statement
// //     if (timerId) {
// //       clearInterval(timerId);
// //       timerId = null;
// //     } else {
// //       draw();
// //       timerId = setInterval(() => {
// //         const bestMove = getBestMove(currentPosition, currentRotation, theBlocks, random, squares, width, draw, undraw);
// //         if (bestMove) {
// //           currentPosition = bestMove.position;
// //           currentRotation = bestMove.rotation;
// //           current = theBlocks[random][currentRotation];
// //           draw();
// //         }
// //         moveDown();
// //       }, 1000);
// //       nextRandom = Math.floor(Math.random() * theBlocks.length);
// //       displayShape();
// //     }
// //   });
  