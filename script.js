var canvas = document.getElementById('canvasElement');
canvas.width  = 800;
canvas.height = 800;
var idVar;

function getOffset() {
  var bounds = getBounds();
  return {
    x: bounds.left + window.scrollX,
    y: bounds.top + window.scrollY,
  };
}

function getBounds() {
  return canvas.getBoundingClientRect();
}

var canvasOffset = getOffset();
var offsetX = canvasOffset.x;
var offsetY = canvasOffset.y;

var ctx = canvas.getContext('2d');
var cols, rows;
w = 40;
cells = [];

width = canvas.width;
height = canvas.height;

cols = width / w;
rows = height / w;


stack = [];
var counter = 0;

var current;

var numberOfCells = canvas.width / w;

function index(i, j) {

  if(i < 0 || j < 0 || i > cols-1 || j > rows-1) {
    return undefined;
  }
  return i + j * cols;
}

var Cell = function(i, j){

  //coordinates
  this.i = i;
  this.j = j;

  //current cell, visited cell, end cell
  this.current = false;
  this.visited = false;
  this.end = false;

  //walls: top, right, bottom, left respectively
  this.walls = [true, true, true, true];

  this.colorPath = function() {
    if(this.visited) {
      ctx.fillStyle = "purple";
    } else if(this.end){
      ctx.fillStyle = "red";
    } else{
      ctx.fillStyle = "black";
    }
  }


  this.show = function() {
    ctx.beginPath();

    var x = this.i * w;
    var y = this.j * w;

    this.colorPath();

    ctx.strokeStyle = "white";

    if(this.walls[0] == true) {
      ctx.moveTo(x, y);
      ctx.lineTo(x + w, y);
    }
    if(this.walls[1] == true) {
      ctx.moveTo(x + w, y);
      ctx.lineTo(x + w, y + w);
    }
    if(this.walls[2] == true) {
      ctx.moveTo(x + w, y + w);
      ctx.lineTo(x, y + w);
    }
    if(this.walls[3]== true) {
      ctx.moveTo(x, y + w);
      ctx.lineTo(x, y);
    }

    ctx.fillRect(x, y, w, w)
    ctx.fill();
    ctx.stroke();
  }

  this.highlight = function() {
    var x = this.i * w;
    var y = this.j * w;
    ctx.beginPath();
    ctx.fillStyle = "yellow";
    ctx.fillRect(x, y, w, w)
    ctx.fill();
  }

}

init();

function step() {

  updateMaze();

  current.visited = true;
  current.highlight();

  //step 1
  var next = current.checkNeighbors();
  if(next) {

    next.visited = true;

    //step 2
    stack.push(current);

    //step 3
    removeWalls(current, next);

    //step 4
    current = next;
  } else if (stack.length > 0) {
    current = stack.pop();
  } else {
    console.log('MAZE GENERATION USING DFS RECURSION SUCCESSFULLY COMPLETED.');
    clearInterval(idVar);
  }
}

function step2() {

  updateMaze();

  current.visited = true;
  current.highlight();

  if(!current.end) {
    var next = current.checkNeighbors();

    if(next && !current.end) {
      next.visited = true;
      stack.push(current);
      current = next;
    } else if (stack.length > 0) {
      current = stack.pop();
    } else if(current.end){
      console.log('MAZE SOLVED.');
      clearInterval(idVar);
    }
  } else {
    console.log('MAZE SOLVED.');
    clearInterval(idVar);
  }
}

function init() {
  console.log("INITIALIZING GRID...");
  for ( var j = 0; j < rows; j++) {
    for( var i = 0; i < cols; i++) {
      var cell = new Cell(i, j);
      cells.push(cell);
    }
  }
  for(var x = 0; x < cells.length; x++) {
    cells[x].show();
  }
  current = cells[0];
  console.log("GRID INITIALIZED SUCCESSFULLY");
}
function removeWalls(current, next) {

  var x = current.i - next.i;

  if(x == 1) {
    current.walls[3] = false;
    next.walls[1] = false;
  } else if (x == -1) {
    current.walls[1] = false;
    next.walls[3] = false;
  }

  var y = current.j - next.j
  if(y == 1) {
    current.walls[0] = false;
    next.walls[2] = false;
  } else if (y == -1) {
    current.walls[2] = false;
    next.walls[0] = false;
  } 

}

function updateMaze() {
  for(var x = 0; x < cells.length; x++) {
    cells[x].show();
  }
}

function clearMaze() {
  console.log('CLEARING MAZE...');
  cells = [];
  for ( var j = 0; j < rows; j++) {
    for( var i = 0; i < cols; i++) {
      var cell = new Cell(i, j);
      cells.push(cell);
    }
  }
  for(var x = 0; x < cells.length; x++) {
    cells[x].show();
  }
  current = cells[0];
  cells[0].current = true;


  for(var i = 0; i < cells.length; i++) {
    console.log(cells[i].current);
  }
  console.log('MAZE CLEARED SUCCESSFULLY');
}

document.getElementById('generateMazeWithDFS').addEventListener('click', function() {
  console.log('GENERATING MAZE USING DFS...');

  Cell.prototype.checkNeighbors = function() {
    var neighbors = [];

    var top = cells[index(this.i, this.j - 1)];
    var right = cells[index(this.i+1, this.j)];
    var bottom = cells[index(this.i, this.j+1)];
    var left = cells[index(this.i - 1, this.j)];

    if(top && !top.visited) {
      neighbors.push(top);
    }
    if(right && !right.visited) {
      neighbors.push(right);
    }
    if(bottom && !bottom.visited) {
      neighbors.push(bottom);
    }
    if(left && !left.visited) {
      neighbors.push(left);
    }
    if(neighbors.length > 0) {
      var r = Math.floor(Math.random() * neighbors.length);
      return neighbors[r];
    } else {
      return undefined;
    }
  }
  cells[0].current = true;
  idVar = setInterval(step, 10);
});

document.getElementById('solveMazeWithDFS').addEventListener('click', function() {
  clearInterval(idVar);
  console.log('SOLVING MAZE USING DFS...');

  for(var i = 0; i < cells.length; i++) {
    cells[i].visited = false;
    cells[i].current = false;
  }

  Cell.prototype.checkNeighbors = function() {
    var neighbors = [];

    var top = cells[index(this.i, this.j - 1)];
    var right = cells[index(this.i+1, this.j)];
    var bottom = cells[index(this.i, this.j+1)];
    var left = cells[index(this.i - 1, this.j)];

    if(top && !top.visited && !this.walls[0]) {
      neighbors.push(top);
    }
    if(right && !right.visited && !this.walls[1]) {
      neighbors.push(right);
    }
    if(bottom && !bottom.visited && !this.walls[2]) {
      neighbors.push(bottom);
    }
    if(left && !left.visited && !this.walls[3]) {
      neighbors.push(left);
    }

    if(neighbors.length > 0) {
      var r = Math.floor(Math.random() * neighbors.length);
      return neighbors[r];
    } else {
      return undefined;
    }
  }
  cells[0].current = true;
  cells[cells.length-1].end = true;
  updateMaze();

  idVar = setInterval(step2, 10);
});

document.getElementById('clearMaze').addEventListener('click', function() {
  clearInterval(idVar);
  clearMaze();
});


// document.getElementById('canvasElement').addEventListener('click', function() {
//   alert();
// })