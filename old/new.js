// document.addEventListener('DOMContentLoaded', () => {
//     const grid = document.querySelector('.grid');
//     let squares = Array.from(document.querySelectorAll('.grid div'));
//     const scoreDisplay = document.querySelector('#score');
//     const startBtn = document.querySelector('#start-button');
//     const width = 10;
//     let nextRandom = 0;
//     let timerId;
//     let score = 0;
//     const colors = ['orange', 'red', 'purple', 'yellow', 'blue'];
      
//         //blocks
//         const lBlock = [
//           [1, width+1, width*2+1, 2],
//           [width, width+1, width+2, width*2+2],
//           [1, width+1, width*2+1, width*2],
//           [width, width*2, width*2+1, width*2+2]
//         ]
      
//         const zBlock = [
//           [0,width,width+1,width*2+1],
//           [width+1, width+2,width*2,width*2+1],
//           [0,width,width+1,width*2+1],
//           [width+1, width+2,width*2,width*2+1]
//         ]
      
//         const tBlock = [
//           [1,width,width+1,width+2],
//           [1,width+1,width+2,width*2+1],
//           [width,width+1,width+2,width*2+1],
//           [1,width,width+1,width*2+1]
//         ]
      
//         const oBlock = [
//           [0,1,width,width+1],
//           [0,1,width,width+1],
//           [0,1,width,width+1],
//           [0,1,width,width+1]
//         ]
      
//         const iBlock = [
//           [1,width+1,width*2+1,width*3+1],
//           [width,width+1,width+2,width+3],
//           [1,width+1,width*2+1,width*3+1],
//           [width,width+1,width+2,width+3]
//         ]
      
//         const theBlocks = [lBlock, zBlock, tBlock, oBlock, iBlock]
      
//         let currentPosition = 4
//         let currentRotation = 0
      
//         console.log(theBlocks[0][0])
      
//         //randomly select a Tetromino and its first rotation
//         let random = Math.floor(Math.random()*theBlocks.length)
//         let current = theBlocks[random][currentRotation]
      
//         //draw the Tetromino
//         function draw() {
//           current.forEach(index => {
//             squares[currentPosition + index].classList.add('tetromino')
//             squares[currentPosition + index].style.backgroundColor = colors[random]
//           })
//         }
      
//         //undraw the Tetromino
//         function undraw() {
//           current.forEach(index => {
//             squares[currentPosition + index].classList.remove('tetromino')
//             squares[currentPosition + index].style.backgroundColor = ''
      
//           })
//         }

//         function freeze() {
//             if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
//                 current.forEach(index => squares[currentPosition + index].classList.add('taken'));
//                 random = nextRandom;
//                 nextRandom = Math.floor(Math.random() * theBlocks.length);
//                 current = theBlocks[random][currentRotation];
//                 currentPosition = 4;
//                 draw();
//                 displayShape();
//                 addScore();
//                 gameOver();
    
//                 // Call autoPlay() instead of moveDown()
//                 autoPlay();
//             }
//         }
//         function control(e) {
//             if (e.keyCode === 37) {
//                 // Remove moveLeft() call
//             } else if (e.keyCode === 38) {
//                 // Remove rotate() call
//                 autoPlay();
//             } else if (e.keyCode === 39) {
//                 // Remove moveRight() call
//             } else if (e.keyCode === 40) {
//                 // Remove moveDown() call
//                 autoPlay();
//             }
//         }
//     // Function to execute AI logic and make moves

//         function autoPlay() {
//         let maxLines = 0;
//         let bestMove;

//         // Iterate over all possible rotations and positions
//         for (let rotation = 0; rotation < theBlocks[random].length; rotation++) {
//             for (let position = 0; position < width; position++) {
//                 // Simulate placing the piece
//                 undraw();
//                 currentRotation = rotation;
//                 currentPosition = position;
//                 draw();

//                 // Count lines cleared after placing the piece
//                 let linesCleared = 0;
//                 while (!current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
//                     moveDown();
//                     linesCleared++;
//                 }

//                 // Update best move
//                 if (linesCleared > maxLines) {
//                     maxLines = linesCleared;
//                     bestMove = { rotation, position };
//                 }
//             }
//         }
//         // Execute the best move
//         undraw();
//         currentRotation = bestMove.rotation;
//         currentPosition = bestMove.position;
//         draw();
//         moveDown();
//     }
//     // Function to start/pause the game
//     startBtn.addEventListener('click', () => {
//         if (timerId) {
//             clearInterval(timerId);
//             timerId = null;
//         } else {
//             draw();
//             timerId = setInterval(autoPlay, 1000);
//             nextRandom = Math.floor(Math.random() * theBlocks.length);
//             displayShape();
//         }
//     });
        
        
//         //show up-next tetromino in mini-grid display
//         const displaySquares = document.querySelectorAll('.mini-grid div')
//         const displayWidth = 4
//         const displayIndex = 0
      
      
//         //the Tetrominos without rotations
//         const upNextTetrominoes = [
//           [1, displayWidth+1, displayWidth*2+1, 2], //lBlock
//           [0, displayWidth, displayWidth+1, displayWidth*2+1], //zBlock
//           [1, displayWidth, displayWidth+1, displayWidth+2], //tBlock
//           [0, 1, displayWidth, displayWidth+1], //oBlock
//           [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iBlock
//         ]
      
//         //display the shape in the mini-grid display
//         function displayShape() {
//           //remove any trace of a tetromino form the entire grid
//           displaySquares.forEach(square => {
//             square.classList.remove('tetromino')
//             square.style.backgroundColor = ''
//           })
//           upNextTetrominoes[nextRandom].forEach( index => {
//             displaySquares[displayIndex + index].classList.add('tetromino')
//             displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
//           })
//         }
      
      
//         //add score
//         function addScore() {
//           for (let i = 0; i < 199; i +=width) {
//             const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]
      
//             if(row.every(index => squares[index].classList.contains('taken'))) {
//               score +=10
//               scoreDisplay.innerHTML = score
//               row.forEach(index => {
//                 squares[index].classList.remove('taken')
//                 squares[index].classList.remove('tetromino')
//                 squares[index].style.backgroundColor = ''
//               })
//               const squaresRemoved = squares.splice(i, width)
//               squares = squaresRemoved.concat(squares)
//               squares.forEach(cell => grid.appendChild(cell))
//             }
//           }
//         }
      
//         //game over
//         function gameOver() {
//           if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
//             scoreDisplay.innerHTML = 'end'
//             clearInterval(timerId)
//           }
//         }
//         timerId = setInterval(autoPlay, 1000);
//       });

  

