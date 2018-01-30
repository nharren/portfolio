'use strict';

var app = app || {};

(function(module) {
  let snake = {};

  const snakeBoardId = 'snake-board';

  snake.blocksX = 25;
  snake.blocksY = 25;
  snake.foodCount = 4;
  snake.initialSize = 3;
  snake.debug = true;
  snake.initialized = false;

  let points = [];
  let food = [];
  let cellWidth;
  let cellHeight;
  let resizeTimer;
  let snakeTimer;
  let direction = 'right';
  let isGrowing = false;

  snake.initialize = function() {
    if (snake.initialized) {
      return;
    }

    let board = document.getElementById(snakeBoardId);
    cellWidth = 100 / snake.blocksX;
    cellHeight = 100 / snake.blocksY;
    document.addEventListener('keydown', handleKeyDown);
    resetSnake();
    updateFood();
    drawSnake(board);
    drawFood(board);
    snakeTimer = window.setInterval(moveSnake, 500);
    resizeTimer = window.setInterval(monitorResize, 100);
    snake.initialized = true;
  };

  snake.reset = function() {
    clear();
    snake.initialize();
  }

  snake.dispose = function() {
    if (snake.initialized) {
      clear();
    }
  }

  let calculateBoardSize = function(board) {
    let boardViewportHeight = getBoardViewportHeight(board);
    let boardViewportWidth = getBoardViewportWidth(board);
    let shortestViewportDimension = Math.min(boardViewportHeight, boardViewportWidth);
    return Math.round(shortestViewportDimension);
  }

  let getBoardViewportHeight = function(board) {
    let style = window.getComputedStyle(board);
    let borderTopWidth = parseFloat(style.getPropertyValue('border-top-width'));
    let borderBottomWidth = parseFloat(style.getPropertyValue('border-bottom-width'));
    return $('main').height() - borderTopWidth - borderBottomWidth;
  }

  let getBoardViewportWidth = function(board) {
    let style = window.getComputedStyle(board);
    let borderLeftWidth = parseFloat(style.getPropertyValue('border-left-width'));
    let borderRightWidth = parseFloat(style.getPropertyValue('border-right-width'));
    return window.innerWidth - borderLeftWidth - borderRightWidth;
  }

  let handleKeyDown = function(event) {
    switch (event.key) {
    case 'ArrowUp':
    case 'w':
      direction = 'up';
      moveSnake();
      break;
    case 'ArrowRight':
    case 'd':
      direction = 'right';
      moveSnake();
      break;
    case 'ArrowDown':
    case 'w':
      direction = 'down';
      moveSnake();
      break;
    case 'ArrowLeft':
    case 'a':
      direction = 'left';
      moveSnake();
      break;
    default:
      break;
    }
  }

  let monitorResize = function() {
    let board = document.getElementById(snakeBoardId);
    let boardSize = calculateBoardSize(board);
    board.style.width = `${boardSize}px`;
    board.style.height = `${boardSize}px`;
  }

  let resetSnake = function() {
    points = [];

    // TODO: Handle condition where the snake's initial size is greater than the board width.

    for (let i = 0; i < snake.initialSize; i++) {
      points.push([i, 0]);
    }
  };

  let updateFood = function() {
    let foodToAdd = snake.foodCount - food.length;

    for (var i = 0; i < foodToAdd; i++) {
      let newFoodPoint;
      let notValid = true;

      while (notValid) {
        let newFoodX = Math.floor(Math.random() * snake.blocksX);
        let newFoodY = Math.floor(Math.random() * snake.blocksY);
        newFoodPoint = [newFoodX, newFoodY];
        notValid = containsPoint(food, newFoodPoint) || containsPoint(points, newFoodPoint);
      }

      food.push(newFoodPoint);
    }
  };

  let drawSnake = function(board) {
    for (let i = 0; i < points.length; i++) {
      let point = points[i];
      drawSnakeBlock(board, point);
    }
  };

  let drawSnakeBlock = function(board, point) {
    drawBlock(board, point, 'snake');
  }

  let drawFood = function(board) {
    for (let i = 0; i < food.length; i++) {
      let point = food[i];
      drawFoodBlock(board, point);
    }
  };

  let drawFoodBlock = function(board, point) {
    drawBlock(board, point, 'snake-food');
  }

  let drawBlock = function(board, point, className) {
    let x = point[0] * cellWidth;
    let y = point[1] * cellHeight;
    let block = document.createElement('div');
    block.classList.add(className);
    block.style.position = 'absolute';
    block.style.top = `${y}%`;
    block.style.left = `${x}%`;
    block.style.width = `${cellWidth}%`;
    block.style.height = `${cellHeight}%`;
    block.setAttribute('data-position', `${point[0]},${point[1]}`);
    board.appendChild(block);
  }

  let moveSnake = function() {
    let board = document.getElementById(snakeBoardId);

    if (isGrowing) {
      isGrowing = false;
    } else {
      let removedPoint = points.shift();
      $(`.snake[data-position="${removedPoint[0]},${removedPoint[1]}"]`).remove();
    }

    let newPoint = calculateNewPoint();

    if (hasBarrier(newPoint)) {
      endGame();
      return;
    }

    points.push(newPoint);
    checkForFood(board, newPoint);
    drawSnakeBlock(board, newPoint);
  };

  let calculateNewPoint = function() {
    let lastPoint = points[points.length - 1];

    switch (direction) {
    case 'up':
      return [lastPoint[0], lastPoint[1] - 1];
    case 'down':
      return [lastPoint[0], lastPoint[1] + 1];
    case 'left':
      return [lastPoint[0] - 1, lastPoint[1]];
    default:
      return [lastPoint[0] + 1, lastPoint[1]];
    }
  }

  let hasBarrier = function(point) {
    let hitWallX = point[0] < 0 || point[0] > snake.blocksX - 1;
    let hitWallY = point[1] < 0 || point[1] > snake.blocksY - 1;
    let hitSelf = containsPoint(points, point);

    return hitWallX || hitWallY || hitSelf;
  }

  let endGame = function() {
    stopSnake();
    window.removeEventListener('keydown', handleKeyDown);
  }

  let stopSnake = function() {
    window.clearInterval(snakeTimer);
  }

  let checkForFood = function(board, point) {
    if (containsPoint(food, point)) {
      food = food.filter(f => !arePointsEqual(f, point));
      isGrowing = true;
      $(`.snake-food[data-position="${point[0]},${point[1]}"]`).remove();
      updateFood();
      drawFoodBlock(board, food[food.length - 1]);
    }
  }

  let clear = function() {
    document.removeEventListener('keydown', handleKeyDown);
    window.clearInterval(snakeTimer);
    window.clearInterval(resizeTimer);
    let board = document.getElementById(snakeBoardId);
    board.innerHTML = '';
    points = [];
    food = [];
    board = null;
    cellWidth = null;
    cellHeight = null;
    resizeTimer = null;
    snakeTimer = null;
    direction = 'right';
    isGrowing = false;
    snake.initialized = false;
  }

  let containsPoint = function(array, point) {
    return array.some(p => arePointsEqual(p, point));
  }

  let arePointsEqual = function(a, b) {
    return a[0] === b[0] && a[1] === b[1];
  }

  module.snake = snake;
})(app);