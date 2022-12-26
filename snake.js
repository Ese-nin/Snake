// =================-------SNAKE-------==================


// create canvas
let canvas = document.getElementById('canvas')
let ctx = canvas.getContext('2d')
let width = canvas.width
let height = canvas.height

// separate game-field to blocks
let blockSize = 10
let widthInBlocks = width / blockSize
let heightInBlocks = height / blockSize

// create score
let score = 0

// create field-border
const drawBorder = function () {
    ctx.fillStyle = 'green'
    ctx.fillRect(0, 0, width, blockSize)
    ctx.fillRect(0, height - blockSize, width, blockSize)
    ctx.fillRect(0, 0, blockSize, height)
    ctx.fillRect(width - blockSize, 0, blockSize, height)
}

// create score-drawing function
const drawScore = function () {
    ctx.fillStyle = 'black'
    ctx.textBaseline = "top";
    ctx.textAlign = 'left'
    ctx.font = "20px Comic Sans MS";
    ctx.fillText("Score: " + score, blockSize + 1, blockSize + 1);
}

// draw circle
let circle = (x, y, r, fillCircle) => {
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    fillCircle ? ctx.fill() : ctx.stroke()
}

// the game over handler
const gameOver = function () {
    clearInterval(intervalId)
    ctx.font = '60px Courier bold'
    ctx.fillStyle = 'black'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('Game Over', width / 2, height / 2)
}

// constructor for block
function Block(column, row) {
    this.row = row;
    this.column = column;
}

Block.prototype.drawSquare = function (color) {
    let x = this.column * blockSize
    let y = this.row * blockSize
    ctx.fillStyle = color
    ctx.fillRect(x, y, blockSize, blockSize)
}

Block.prototype.drawCircle = function (color) {
    let centerX = this.column * blockSize + blockSize / 2
    let centerY = this.row * blockSize + blockSize / 2
    ctx.fillStyle = color
    circle(centerX, centerY, blockSize / 2, true)
}

Block.prototype.equal = function (otherBlock) {
    return this.column === otherBlock.column && this.row === otherBlock.row;
};


// constructor for Snake
function Snake() {
    this.segments = [
        new Block(7, 5),
        new Block(6, 5),
        new Block(5, 5),
    ]

    this.direction = 'right'
    this.nextDirection = 'right'
}

Snake.prototype.draw = function () {
    for (let i = 0; i < this.segments.length; i++) {
        if (i === 0) {
            this.segments[i].drawSquare('gold')
        } else {
            this.segments[i].drawSquare('LightBlue')
        }
    }
}

Snake.prototype.move = function () {
    let head = this.segments[0];
    let newHead;

    this.direction = this.nextDirection

    if (this.direction === 'right') {
        newHead = new Block(head.column + 1, head.row)
    } else if (this.direction === 'up') {
        newHead = new Block(head.column, head.row - 1)
    } else if (this.direction === 'left') {
        newHead = new Block(head.column - 1, head.row)
    } else if (this.direction === 'down') {
        newHead = new Block(head.column, head.row + 1)
    }

    if (this.checkCollision(newHead)) {
        gameOver()
        return
    }

    this.segments.unshift(newHead)

    if (newHead.equal(apple.position)) {
        score++
        apple.move()
    } else {
        this.segments.pop()
    }
}

Snake.prototype.checkCollision = function (head) {
    let leftCollision = (head.column === 0)
    let topCollision = (head.row === 0)
    let rightCollision = (head.column === widthInBlocks - 1)
    let bottomCollision = (head.row === heightInBlocks - 1)

    let wallCollision = leftCollision || topCollision || rightCollision || bottomCollision

    let selfCollision = false

    for (let i = 0; i < this.segments.length; i++) {
        if (head.equal(this.segments[i])) {
            selfCollision = true
        }
    }

    return wallCollision || selfCollision
}

Snake.prototype.setDirection = function (newDirection) {
    if (this.direction === 'up' && newDirection === 'down') {
        return
    } else if (this.direction === 'down' && newDirection === 'up') {
        return
    } else if (this.direction === 'left' && newDirection === 'right') {
        return
    } else if (this.direction === 'right' && newDirection === 'left') {
        return
    }

    this.nextDirection = newDirection
}


// constructor for apple
function Apple() {
    this.position = new Block(10, 10)
}

Apple.prototype.draw = function () {
    this.position.drawCircle('LimeGreen')
}

Apple.prototype.move = function () {
    let randomColumn = Math.floor(Math.random() * (widthInBlocks - 2)) + 1
    let randomRow = Math.floor(Math.random() * (heightInBlocks - 2)) + 1
    this.position = new Block(randomColumn, randomRow)
}

// create Snake and Apple
let snake = new Snake()
let apple = new Apple()

// heart of the game
let intervalId = setInterval(() => {
    ctx.clearRect(0, 0, width, height)
    drawScore()
    snake.move()
    snake.draw()
    apple.draw()
    drawBorder()
}, 100)

// handle keyboard events
const directions = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
}

$('body').keydown(function (e) {
    let newDirection = directions[e.keyCode]
    if (newDirection !== undefined) {
        snake.setDirection(newDirection)
    }
})


// handle restart-button
const button = document.getElementById('restart')
button.addEventListener('click', restartHandle)

function restartHandle() {
    clearInterval(intervalId)
    score = 0
    snake = new Snake()
    apple = new Apple()
    intervalId = setInterval(() => {
        ctx.clearRect(0, 0, width, height)
        drawScore()
        snake.move()
        snake.draw()
        apple.draw()
        drawBorder()
    }, 100)
}