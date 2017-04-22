var cnv;  //Canvas object.
var bckColor; //Backgorund color.
var digraph;  //Directed graph data structure.
var takenNames = []; //Array of taken vertex names for checking.

var name; //Name input.

/*
 * Initialize user interface.
 */
function setup() {
  cnv = createCanvas(1000, 800);
  bckColor = color(54, 63, 69);
  digraph = new Digraph();
  setInterface();
  centerElements();
  test();
}

//Temp, for testing.
function test(){
  let v1 = new Vertex('first', 10, 300);
  let v2 = new Vertex('second', 70, 300);
  let v3 = new Vertex('third', 80, 400);
  let v4 = new Vertex('fourth', 400, 200);
  let v5 = new Vertex('fifth', 200, 100);
  digraph.addVertex(v1);
  digraph.addVertex(v2);
  digraph.addVertex(v3);
  digraph.addVertex(v4);
  digraph.addVertex(v5);
  digraph.addEdge(v1, v2);
  digraph.addEdge(v3, v2);
  digraph.addEdge(v5, v3);
  digraph.addEdge(v3, v5);
  console.log(digraph.matrix);
}

/*
 * Looped through p5.
 */
function draw(){
  background(54, 63, 69);
}

function setInterface(){
  input = createInput();
}

function mousePressed(){
  let v = new Vertex(input.value(), mouseX, mouseY);
  takenNames.push(v.name);
  console.log(v.name);
  input.value('');
}

/*
 * Called when window resized through p5.
 */
function windowResized(){
  centerElements();
}

/*
 *  Center/recenter canvas to window.
 */
function centerElements(){
  let x = (windowWidth-width)/2-50;  //Center horizontally.
  let y = 100; //Margin from top.
  cnv.position(x, y);

  input.position(x+width+25, y);
}
