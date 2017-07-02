'use strict';

var app = app || {};

(function(module) {
  let snake = {}; 

  snake.blocksX = 25;
  snake.blocksY = 25;
  snake.foodCount = 4;
  snake.initialSize = 3;
  snake.debug = true;
  snake.initialized = false;

  let points = [];
  let food = [];
  let board;
  let cellWidth;
  let cellHeight;
  let resizeTimer;
  let snakeTimer;
  let direction = 'right';
  let isGrowing = false;

  snake.initialize = function() {
    if (snake.initialized) return;

    getBoard();
    measureBoard();
    cellWidth = 100 / snake.blocksX;
    cellHeight = 100 / snake.blocksY;
    handleKeyboard();
    resetSnake();
    updateFood();
    drawSnake();
    drawFood();
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

  let getBoard = function() {
    board = $('.snake-board');
  };

  let measureBoard = function() {
    let bt = parseFloat(board.css('borderTopWidth'));
    let bb = parseFloat(board.css('borderBottomWidth'));
    let bl = parseFloat(board.css('borderLeftWidth'));
    let br = parseFloat(board.css('borderRightWidth'));

    let boardSize = Math.round(Math.min($('main').height() - bt - bb, window.innerWidth - bl - br));

    board.width(boardSize);
    board.height(boardSize);
  };

  let handleKeyboard = function() {
    $(window).on('keydown', handleKeyDown);
  };

  let handleKeyDown = function(event) {
    switch (event.which) {
    case keys.up:
    case keys.w:
      direction = 'up';
      moveSnake();
      break;
    case keys.right:
    case keys.d:
      direction = 'right';
      moveSnake();
      break;
    case keys.down:
    case keys.s:
      direction = 'down';
      moveSnake();
      break;
    case keys.left:
    case keys.a:
      direction = 'left';
      moveSnake();
      break;
    default:
      break;
    }
  }

  const keys = {
    up: 38,
    down: 40,
    left: 37,
    right: 39,
    w: 87,
    s: 83,
    a: 65,
    d: 68
  }

  let monitorResize = function() {
    measureBoard();
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
    if (snake.dubug) console.log('Current food count: '+ food.length);

    for (var i = 0; i < foodToAdd; i++) {
      let newFoodPoint;
      let notValid = true;

      while (notValid) {
        let newFoodX = Math.floor(Math.random() * snake.blocksX);
        let newFoodY = Math.floor(Math.random() * snake.blocksY);
        newFoodPoint = [newFoodX, newFoodY];
        notValid = food.some(e => e.equals(newFoodPoint)) || points.some(e => e.equals(newFoodPoint));
      }

      food.push(newFoodPoint);
      if (snake.debug) console.log('Created food at ' + newFoodPoint);
    }
  };

  let drawSnake = function() {
    for (let i = 0; i < points.length; i++) {
      let point = points[i];
      drawSnakeBlock(point);
    }
  };

  let drawSnakeBlock = function(point) {
    drawBlock(point, 'snake');
  }

  let drawFood = function() {
    for (let i = 0; i < food.length; i++) {
      let point = food[i];
      drawFoodBlock(point);
    }
  };

  let drawFoodBlock = function(point) {
    drawBlock(point, 'snake-food');
  }

  let drawBlock = function(point, className) {
    let x = point[0] * cellWidth;
    let y = point[1] * cellHeight;
    let block = $('<div></div>');
    block.addClass(className);
    block.css('position', 'absolute');
    block.css('top', `${y}%`);
    block.css('left', `${x}%`);
    block.css('width', `${cellWidth}%`);
    block.css('height', `${cellHeight}%`);
    block.attr('data-position', `${point[0]},${point[1]}`);
    board.append(block);
  }

  let moveSnake = function() {
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
    checkForFood(newPoint);
    drawSnakeBlock(newPoint);
  };

  let calculateNewPoint = function() {
    let lastPoint = points[points.length - 1];
    let newPoint;

    switch (direction) {
    case 'up':
      newPoint = [lastPoint[0], lastPoint[1] - 1];
      break;
    case 'down':
      newPoint = [lastPoint[0], lastPoint[1] + 1];
      break;
    case 'right':
      newPoint = [lastPoint[0] + 1, lastPoint[1]];
      break;
    case 'left':
      newPoint = [lastPoint[0] - 1, lastPoint[1]];
      break;
    default:
      console.log(`"${direction}" is an invalid direction.`);
      break;
    }

    return newPoint;
  }

  let hasBarrier = function(point) {
    let hitWallX = point[0] < 0 || point[0] > snake.blocksX - 1;
    let hitWallY = point[1] < 0 || point[1] > snake.blocksY - 1;
    let hitSelf = points.some(p => p.equals(point));

    if (snake.debug) {
      if (hitWallX) console.log('Hit left or right wall at ' + point);
      if (hitWallY) console.log('Hit top or bottom wall at ' + point);
      if (hitSelf) console.log('Hit self at ' + point);
    }

    return hitWallX || hitWallY || hitSelf;
  }

  let endGame = function() {
    stopSnake();
    $(window).off('keydown');
  }

  let stopSnake = function() {
    window.clearInterval(snakeTimer);
  }

  let checkForFood = function(point) {
    let onFood = food.filter(f => f.equals(point));

    if (onFood.length > 0) {
      food = food.filter(f => !f.equals(point));
      isGrowing = true;
      $(`.snake-food[data-position="${point[0]},${point[1]}"]`).remove();
      if (snake.debug) console.log('Food eaten at ' + onFood.toString());
      updateFood();
      drawFoodBlock(food[food.length - 1]);
    }
  }

  Array.prototype.equals = function (array) {
    if (!array) {
      return false;
    }

    if (this.length !== array.length) {
      return false;
    }

    for (let i = 0, l=this.length; i < l; i++) {
      if (Array.isArray(this[i]) && Array.isArray(array[i])) {
        if (!this[i].equals(array[i]))
          return false;
      }
      else if (this[i] !== array[i]) {
        return false;
      }
    }
    return true;
  }

  Object.defineProperty(Array.prototype, 'equals', {enumerable: false});

  let clear = function() {
    $(window).off('keydown');
    window.clearInterval(snakeTimer);
    window.clearInterval(resizeTimer);
    $('.snake-board').empty();
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

  module.snake = snake;
})(app);