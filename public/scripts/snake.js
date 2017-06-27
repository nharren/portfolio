var snake = {};

snake.blocksX = 30;
snake.blocksY = 30;
snake.foodCount = 4;
snake.initialSize = 3;

snake.points = [];
snake.food = [];
snake.$board;
snake.width;
snake.height;
snake.cellWidth;
snake.cellHeight;
snake.timer;
snake.direction = 'right';
snake.isGrowing = false;

snake.initialize = function() {
  snake.getBoard();
  snake.measureBoard();
  snake.handleKeyboard();
  snake.resetSnake();
  snake.updateFood();
  snake.drawSnake();
  snake.drawFood();
  snake.start();
};

snake.handleKeyboard = function() {
  $(window).on('keydown', snake.handleKeyDown);
};

snake.handleKeyDown = function(event) {
  switch (event.which) {
  case 38: /* Up */
  case 87: /* W */
    snake.direction = 'up';
    snake.moveSnake();
    break;
  case 39: /* Right */
  case 68: /* D */
    snake.direction = 'right';
    snake.moveSnake();
    break;
  case 40: /* Down */
  case 83: /* S */
    snake.direction = 'down';
    snake.moveSnake();
    break;
  case 37: /* Left */
  case 65: /* A */
    snake.direction = 'left';
    snake.moveSnake();
    break;
  default:
    break;
  }
}

snake.getBoard = function() {
  snake.$board = $('.snake-board');
  console.log(snake.$board.height());
  snake.$board.width(snake.$board.height());
};

snake.measureBoard = function() {
  snake.width = snake.$board.width();
  snake.height = snake.$board.height();
  snake.cellWidth = snake.width / snake.blocksX;
  snake.cellHeight = snake.height / snake.blocksY;
};

snake.resetSnake = function() {
  snake.points = [];

  // TODO: Handle condition where the snake's initial size is greated than the board width.

  for (let i = 0; i < snake.initialSize; i++) {
    snake.points.push([i, 0]);
  }
};

snake.updateFood = function() {
  let foodToAdd = snake.foodCount - snake.food.length;

  for (var i = 0; i < foodToAdd; i++) {
    let newFoodPoint;
    let notValid = true;

    while (notValid) {
      let newFoodX = Math.floor(Math.random() * snake.blocksX);
      let newFoodY = Math.floor(Math.random() * snake.blocksY);
      newFoodPoint = [newFoodX, newFoodY];
      notValid = snake.food.some(e => e === newFoodPoint);
      notValid = notValid && snake.points.some(e => e === newFoodPoint);
    }

    snake.food.push(newFoodPoint);
  }
};

snake.drawSnake = function() {
  for (let i = 0; i < snake.points.length; i++) {
    let point = snake.points[i];
    snake.drawSnakeBlock(point);
  }
};

snake.drawSnakeBlock = function(point) {
  let x = point[0] * snake.cellWidth;
  let y = point[1] * snake.cellHeight;
  let block = $('<div class="snake"></div>');
  block.attr('style',`position: absolute; top: ${y}px; left: ${x}px; width: ${snake.cellWidth}px; height: ${snake.cellHeight}px; background-color: black;`);
  block.attr('data-position', `${point[0]},${point[1]}`);
  snake.$board.append(block);
}

snake.drawFood = function() {
  for (let i = 0; i < snake.food.length; i++) {
    let point = snake.food[i];
    snake.drawFoodBlock(point);
  }
};

snake.drawFoodBlock = function(point) {
  let x = point[0] * snake.cellWidth;
  let y = point[1] * snake.cellHeight;
  let block = $('<div></div>');
  block.addClass('snake-food');
  block.css('position', 'absolute');
  block.css('top', `${y}px;`);
  block.css('left', `${x}px`);
  block.css('width', `${snake.cellWidth}px`); 
  block.css('height', `${snake.cellHeight}px`); 
  block.css('background-color', 'white');
  block.attr('data-position', `${point[0]},${point[1]}`);
  snake.$board.append(block);
}

snake.start = function() {
  snake.timer = window.setInterval(snake.moveSnake, 500);
};

snake.moveSnake = function() {
  if (snake.isGrowing) {
    snake.isGrowing = false;
  } else {
    let removedPoint = snake.points.shift();
    $(`.snake[data-position="${removedPoint[0]},${removedPoint[1]}"]`).remove();
  }
  
  let newPoint = snake.calculateNewPoint();

  if (snake.hasBarrier(newPoint)) {
    snake.endGame();
    return;
  }

  snake.points.push(newPoint);
  snake.checkForFood(newPoint);
  snake.drawSnakeBlock(newPoint);
};

snake.calculateNewPoint = function() {
  let lastPoint = snake.points[snake.points.length - 1];
  let newPoint = [];

  switch (snake.direction) {
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
    console.log(`"${snake.direction}" is an invalid direction.`);
    break;
  }

  return newPoint;
}

snake.hasBarrier = function(point) {
  let hitWallX = point[0] < 0 || point[0] > snake.blocksX - 1;
  let hitWallY = point[1] < 0 || point[1] > snake.blocksY - 1;
  let hitSelf = snake.points.some(p => p === point);

  return hitWallX || hitWallY || hitSelf;
}

snake.endGame = function() {
  snake.stopSnake();
  $(window).off('keydown');
}

snake.stopSnake = function() {
  window.clearInterval(snake.timer);
}

snake.checkForFood = function(point) {
  let onFood = snake.food.filter(f => f[0] === point[0] && f[1] === point[1]);
  if (onFood.length > 0) {
    snake.food = snake.food.filter(f => f[0] !== point[0] && f[1] !== point[1]);
    snake.isGrowing = true;
    $(`.snake-food[data-position="${point[0]},${point[1]}"]`).remove();
    console.log('ate food at ' + onFood.toString());
    snake.updateFood();
    snake.drawFoodBlock(snake.food[snake.food.length - 1]);
  }
}