'use strict';

var app = app || {};

(function(module) {
  var snake = {};

  snake.blocksX = 30;
  snake.blocksY = 30;
  snake.foodCount = 4;
  snake.initialSize = 3;
  snake.debug = false;
  snake.initialized = false;

  let points = [];
  let food = [];
  let board;
  let width;
  let height;
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
    handleKeyboard();
    resetSnake();
    updateFood();
    drawSnake();
    drawFood();
    snake.start();
    resizeTimer = window.setInterval(monitorResize, 100);
    snake.initialized = true;
  };

  snake.start = function() {
    snakeTimer = window.setInterval(moveSnake, 500);
  };

  snake.dispose = function() {
    window.clearInterval(snakeTimer);
    window.clearInterval(resizeTimer);
    snake.initialized = false;
  }

  let getBoard = function() {
    board = $('.snake-board');
  };

  let measureBoard = function() {
    height = board.innerHeight();
    board.width(board.innerHeight());
    width = height;
    
    cellWidth = width / snake.blocksX;
    cellHeight = height / snake.blocksY;
  };

  let handleKeyboard = function() {
    $(window).on('keydown', handleKeyDown);
  };

  let handleKeyDown = function(event) {
    switch (event.which) {
    case 38: /* Up */
    case 87: /* W */
      direction = 'up';
      moveSnake();
      break;
    case 39: /* Right */
    case 68: /* D */
      direction = 'right';
      moveSnake();
      break;
    case 40: /* Down */
    case 83: /* S */
      direction = 'down';
      moveSnake();
      break;
    case 37: /* Left */
    case 65: /* A */
      direction = 'left';
      moveSnake();
      break;
    default:
      break;
    }
  }

  let monitorResize = function() {
    if ($('.snake-board').innerHeight() !== height) {
      measureBoard();
      $('.snake').remove();
      drawSnake();
      $('.snake-food').remove();
      drawFood();
    }
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
        notValid = food.some(e => e[0] === newFoodPoint[0] && e[1] === newFoodPoint[1]);
        notValid = notValid && points.some(e => e[0] === newFoodPoint[0] && e[1] === newFoodPoint[1]);
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
    drawBlock(point, 'snake', 'black');
  }

  let drawFood = function() {
    for (let i = 0; i < food.length; i++) {
      let point = food[i];
      drawFoodBlock(point);
    }
  };

  let drawFoodBlock = function(point) {
    drawBlock(point, 'snake-food', 'white');
  }

  let drawBlock = function(point, className, color) {
    let x = point[0] * cellWidth;
    let y = point[1] * cellHeight;
    let block = $('<div></div>');
    block.addClass(className);
    block.css('position', 'absolute');
    block.css('top', `${y}px`);
    block.css('left', `${x}px`);
    block.css('width', `${cellWidth}px`);
    block.css('height', `${cellHeight}px`);
    block.css('background-color', color);
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
    let newPoint = [];

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
    let hitSelf = points.some(p => p[0] === point[0] && p[1] === point[1]);

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
    let onFood = food.filter(f => f[0] === point[0] && f[1] === point[1]);
    if (onFood.length) {
      food = food.filter(f => f[0] !== point[0] && f[1] !== point[1]);
      isGrowing = true;
      $(`.snake-food[data-position="${point[0]},${point[1]}"]`).remove();
      if (snake.debug) console.log('Food eaten at ' + onFood.toString());
      updateFood();
      drawFoodBlock(food[food.length - 1]);
    }
  }

  module.snake = snake;
})(app);