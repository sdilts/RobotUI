var cnv;  //Canvas object.
var bckColor; //Backgorund color.
var digraph;  //Directed graph data structure.
var takenNames = []; //Array of taken vertex names for checking.

var nameLabel; //Label for name input.
var nameInput; //Name input.
var clearButton; //Button for clearing points.

/*
 * Initialize user interface.
 */
function setup() {
  cnv = createCanvas(1000, 800);
  bckColor = color(54, 63, 69);
  digraph = new Digraph();
  setInterface();
  centerElements();
  //test();
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
  console.log(JSON.stringify(digraph.matrix));
  console.log(JSON.stringify(digraph.vertices));
}

/*
 * Looped through p5.
 */
function draw(){
  background(54, 63, 69);
  digraph.draw();
}

function setInterface(){
  nameInput = createInput('');
  nameLabel = createP('Point name:');
  clearButton = createButton('CLEAR');
  //clearButton.mousePressed(clear);
}



function mousePressed(){
  //Is the name taken?
  let taken = takenNames.indexOf(nameInput.value()) != -1;
  //Is the name empty?
  let empty = nameInput.value() == '';
  //Are the mouse coordinates inside the canvas?
  let inside = mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height;

  if(inside){
    if(!empty){
      if(!taken){
        let v = new Vertex(nameInput.value(), mouseX, mouseY);
        digraph.addVertex(v);
        takenNames.push(v.name);
        console.log(v.name);
        nameInput.value('');
      }else{
        console.log("Point name is taken.");
      }
    }else{
      console.log("Point name is empty.");
    }
  }
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
  let y = 50; //Margin from top.
  cnv.position(x, y);

  nameLabel.position(x+width+25, y);
  nameInput.position(x+width+25, y+35);
  clearButton.position(x+width+25, y+75);
}
