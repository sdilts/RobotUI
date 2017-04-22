var cnv;  //Canvas object.
var bckColor; //Backgorund color.

/*
 * Initialize user interface.
 */
function setup() {
  cnv = createCanvas(1000, 800);
  centerCanvas();
  bckColor = color(54, 63, 69);
  test();
}

//Temp, for testing.
function test(){
  let dg = new Digraph();
  let v1 = new Vertex('first', 10, 300);
  let v2 = new Vertex('second', 70, 300);
  let v3 = new Vertex('third', 80, 400);
  let v4 = new Vertex('fourth', 400, 200);
  let v5 = new Vertex('fifth', 200, 100);
  dg.addVertex(v1);
  dg.addVertex(v2);
  dg.addVertex(v3);
  dg.addVertex(v4);
  dg.addVertex(v5);
  dg.addEdge(v1, v2);
  dg.addEdge(v3, v2);
  dg.addEdge(v5, v3);
  dg.addEdge(v3, v5);
  dg.print();
}

/*
 * Looped through p5.
 */
function draw() {
  background(54, 63, 69);
}

/*
 * Called when window resized through p5.
 */
function windowResized(){
  centerCanvas();
}

/*
 *  Center/recenter canvas to window.
 */
function centerCanvas(){
  let x = (windowWidth-width)/2;  //Center horizontally.
  let y = 50; //Margin from top.
  cnv.position(x,y);
}
