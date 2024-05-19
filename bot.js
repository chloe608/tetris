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

    // Blocks definition
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

    // Randomly select a Tetromino and its first rotation
    let random = Math.floor(Math.random() * theBlocks.length);
    let current = theBlocks[random][currentRotation];

    // Draw the Tetromino
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino');
            squares[currentPosition + index].style.backgroundColor = colors[random];
        });
    }

    // Undraw the Tetromino
    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino');
            squares[currentPosition + index].style.backgroundColor = '';
        });
    }

    // Move down function
    function moveDown() {
        undraw();
        currentPosition += width;
        draw();
        freeze();
    }

    // Freeze function
    function freeze() {
        if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'));
            // Start a new Tetromino falling
            random = nextRandom;
            nextRandom = Math.floor(Math.random() * theBlocks.length);
            current = theBlocks[random][currentRotation];
            currentPosition = 4;
            draw();
            displayShape();
            addScore();
            gameOver();
            if (timerId) runBot();
        }
    }

    // Move the Tetromino left, unless at the edge or there is a blockage
    function moveLeft() {
        undraw();
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
        if (!isAtLeftEdge) currentPosition -= 1;
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1;
        }
        draw();
    }

    // Move the Tetromino right, unless at the edge or there is a blockage
    function moveRight() {
        undraw();
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);
        if (!isAtRightEdge) currentPosition += 1;
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1;
        }
        draw();
    }

    // Fix rotation of Tetrominos at the edge
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

    // Rotate the Tetromino
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

    // Show up-next Tetromino in mini-grid display
    const displaySquares = document.querySelectorAll('.mini-grid div');
    const displayWidth = 4;
    const displayIndex = 0;

    // The Tetrominos without rotations
    const upNextTetrominoes = [
        [1, displayWidth + 1, displayWidth * 2 + 1, 2], // lBlock
        [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], // zBlock
        [1, displayWidth, displayWidth + 1, displayWidth + 2], // tBlock
        [0, 1, displayWidth, displayWidth + 1], // oBlock
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1] // iBlock
    ];

    // Display the shape in the mini-grid display
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

    // Add functionality to the button
    startBtn.addEventListener('click', () => {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
        } else {
            draw();
            timerId = setInterval(moveDown, 1000);
            nextRandom = Math.floor(Math.random() * theBlocks.length);
            displayShape();
            runBot();
        }
    });

    // Add score
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

    // Game over
    function gameOver() {
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = 'end';
            clearInterval(timerId);
        }
    }

    // Bot logic
    function runBot() {
        const possibleMoves = [];
        for (let rotation = 0; rotation < current.length; rotation++) {
            const shape = theBlocks[random][rotation];
            for (let pos = 0; pos < width; pos++) {
                if (canMoveTo(shape, pos)) {
                    const tempPosition = currentPosition;
                    currentPosition = pos;
                    const lines = getLinesCleared(shape);
                    const holes = getHolesCreated(shape);
                    possibleMoves.push({ shape, pos, rotation, score: evaluate(lines, holes) });
                    currentPosition = tempPosition;
                }
            }
        }
        const bestMove = possibleMoves.sort((a, b) => b.score - a.score)[0];
        current = theBlocks[random][bestMove.rotation];
        currentPosition = bestMove.pos;
        draw();
        timerId = setInterval(moveDown, 1000);
    }

    function canMoveTo(shape, position) {
        return !shape.some(index => {
            const target = position + index;
            return target >= 200 || squares[target].classList.contains('taken') || target % width >= 10;
        });
    }

    function getLinesCleared(shape) {
        const pos = currentPosition;
        const rows = new Set(shape.map(index => Math.floor((pos + index) / width)));
        let lines = 0;
        rows.forEach(row => {
            if (Array.from({ length: width }, (_, i) => squares[row * width + i]).every(cell => cell.classList.contains('taken'))) {
                lines++;
            }
        });
        return lines;
    }

    function getHolesCreated(shape) {
        const pos = currentPosition;
        const columns = new Set(shape.map(index => (pos + index) % width));
        let holes = 0;
        columns.forEach(col => {
            let hit = false;
            for (let i = col; i < 200; i += width) {
                if (hit && !squares[i].classList.contains('taken')) holes++;
                if (squares[i].classList.contains('taken')) hit = true;
            }
        });
        return holes;
    }

    function evaluate(lines, holes) {
        timerId = setInterval(moveDown, 500); // Faster bot
        return lines * 10 - holes * 5;
    }
});
// document.addEventListener('DOMContentLoaded', () => {
//     const grid = document.querySelector('.grid')
//     let squares = Array.from(document.querySelectorAll('.grid div'))
//     const scoreDisplay = document.querySelector('#score')
//     const startBtn = document.querySelector('#start-button')
//     const width = 10
//     let nextRandom = 0
//     let timerId
//     let score = 0
//     const colors = [
//         'orange',
//         'red',
//         'purple',
//         'yellow',
//         'blue'
//     ]

//     const lBlock = [
//         [1, width+1, width*2+1, 2],
//         [width, width+1, width+2, width*2+2],
//         [1, width+1, width*2+1, width*2],
//         [width, width*2, width*2+1, width*2+2]
//     ]

//     const zBlock = [
//         [0,width,width+1,width*2+1],
//         [width+1, width+2,width*2,width*2+1],
//         [0,width,width+1,width*2+1],
//         [width+1, width+2,width*2,width*2+1]
//     ]

//     const tBlock = [
//         [1,width,width+1,width+2],
//         [1,width+1,width+2,width*2+1],
//         [width,width+1,width+2,width*2+1],
//         [1,width,width+1,width*2+1]
//     ]

//     const oBlock = [
//         [0,1,width,width+1],
//         [0,1,width,width+1],
//         [0,1,width,width+1],
//         [0,1,width,width+1]
//     ]

//     const iBlock = [
//         [1,width+1,width*2+1,width*3+1],
//         [width,width+1,width+2,width+3],
//         [1,width+1,width*2+1,width*3+1],
//         [width,width+1,width+2,width+3]
//     ]

//     const theBlocks = [lBlock, zBlock, tBlock, oBlock, iBlock]

//     let currentPosition = 4
//     let currentRotation = 0

//     //randomly select a Tetromino and its first rotation
//     let random = Math.floor(Math.random() * theBlocks.length)
//     let current = theBlocks[random][currentRotation]

//     //draw the Tetromino
//     function draw() {
//         current.forEach(index => {
//             squares[currentPosition + index].classList.add('tetromino')
//             squares[currentPosition + index].style.backgroundColor = colors[random]
//         })
//     }

//     //undraw the Tetromino
//     function undraw() {
//         current.forEach(index => {
//             squares[currentPosition + index].classList.remove('tetromino')
//             squares[currentPosition + index].style.backgroundColor = ''
//         })
//     }

//     //assign functions to keyCodes
//     function control(e) {
//         if (e.keyCode === 37) {
//             moveLeft()
//         } else if (e.keyCode === 38) {
//             rotate()
//         } else if (e.keyCode === 39) {
//             moveRight()
//         } else if (e.keyCode === 40) {
//             moveDown()
//         }
//     }
//     document.addEventListener('keyup', control)

//     //move down function
//     function moveDown() {
//         undraw()
//         currentPosition += width
//         draw()
//         freeze()
//     }

//     //freeze function
//     function freeze() {
//         if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
//             current.forEach(index => squares[currentPosition + index].classList.add('taken'))
//             random = nextRandom
//             nextRandom = Math.floor(Math.random() * theBlocks.length)
//             current = theBlocks[random][currentRotation]
//             currentPosition = 4
//             draw()
//             displayShape()
//             addScore()
//             gameOver()
//         }
//     }

//     //move the tetromino left, unless is at the edge or there is a blockage
//     function moveLeft() {
//         undraw()
//         const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
//         if (!isAtLeftEdge) currentPosition -= 1
//         if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
//             currentPosition += 1
//         }
//         draw()
//     }

//     //move the tetromino right, unless is at the edge or there is a blockage
//     function moveRight() {
//         undraw()
//         const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)
//         if (!isAtRightEdge) currentPosition += 1
//         if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
//             currentPosition -= 1
//         }
//         draw()
//     }

//     function rotate() {
//         undraw()
//         currentRotation++
//         if (currentRotation === current.length) {
//             currentRotation = 0
//         }
//         current = theBlocks[random][currentRotation]
//         draw()
//     }

//     //show up-next tetromino in mini-grid display
//     const displaySquares = document.querySelectorAll('.mini-grid div')
//     const displayWidth = 4
//     const displayIndex = 0

//     //the Tetrominos without rotations
//     const upNextTetrominoes = [
//         [1, displayWidth+1, displayWidth*2+1, 2], //lBlock
//         [0, displayWidth, displayWidth+1, displayWidth*2+1], //zBlock
//         [1, displayWidth, displayWidth+1, displayWidth+2], //tBlock
//         [0, 1, displayWidth, displayWidth+1], //oBlock
//         [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iBlock
//     ]

//     //display the shape in the mini-grid display
//     function displayShape() {
//         displaySquares.forEach(square => {
//             square.classList.remove('tetromino')
//             square.style.backgroundColor = ''
//         })
//         upNextTetrominoes[nextRandom].forEach(index => {
//             displaySquares[displayIndex + index].classList.add('tetromino')
//             displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
//         })
//     }

//     //add functionality to the button
//     startBtn.addEventListener('click', () => {
//         if (timerId) {
//             clearInterval(timerId)
//             timerId = null
//         } else {
//             draw()
//             timerId = setInterval(moveDown, 1000)
//             nextRandom = Math.floor(Math.random() * theBlocks.length)
//             displayShape()
//         }
//     })

//     //add score
//     function addScore() {
//         for (let i = 0; i < 199; i += width) {
//             const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]
//             if (row.every(index => squares[index].classList.contains('taken'))) {
//                 score += 10
//                 scoreDisplay.innerHTML = score
//                 row.forEach(index => {
//                     squares[index].classList.remove('taken')
//                     squares[index].classList.remove('tetromino')
//                     squares[index].style.backgroundColor = ''
//                 })
//                 const squaresRemoved = squares.splice(i, width)
//                 squares = squaresRemoved.concat(squares)
//                 squares.forEach(cell => grid.appendChild(cell))
//             }
//         }
//     }

//     //game over
//     function gameOver() {
//         if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
//             scoreDisplay.innerHTML = 'end'
//             clearInterval(timerId)
//         }
//     }
// })
