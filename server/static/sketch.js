var cnv;  //Canvas object.
var bckColor; //Backgorund color.
var digraph;  //Directed graph data structure.
var takenNames = []; //Array of taken vertex names for checking.
var selected = null; //Currently selected vertex for edge creation.
var selLine = []; //Array of two points for drawing a selection line.

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
  digraph.addEdge(v1.name, v2.name);
  digraph.addEdge(v3.name, v2.name);
  digraph.addEdge(v5.name, v3.name);
  digraph.addEdge(v3.name, v5.name);
  console.log(JSON.stringify(digraph.matrix));
  console.log(JSON.stringify(digraph.vertices));
}

/*
 * Looped through p5.
 */
function draw(){
  background(54, 63, 69);
  digraph.draw();
  stroke(255);
  strokeWeight(2);
  //line(selLine[0], selLine[1], selLine[2], selLine[3]);
}

function setInterface(){
  nameInput = createInput('');
  nameLabel = createP('Point name:');
  clearButton = createButton('CLEAR');
  clearButton.mousePressed(clearGraph);
}

function clearGraph(){
  digraph = new Digraph();
  takenNames = [];
}

function mousePressed(){
  if(selected === null){
    let collision = checkClick(mouseX, mouseY);
    if(collision !== null){
      selected = collision;
    }else{
      createVertex();
    }
  }else{
    let collision = checkClick(mouseX, mouseY);
    if(collision === null){
      selected = null;
    }else{
      digraph.addEdge(selected, collision);
      selected = null;
    }
  }
}

function mouseMoved(){

}

/*
 *  Check if the mouse has clicked a vertex.
 */
function checkClick(x, y){
  for(let key in digraph.vertices){
    if(dist(digraph.vertices[key]['x'], digraph.vertices[key]['y'], x, y) < 15){
      return key;
    }
  }
  return null;
}

function createVertex(){
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
  let y = 100; //Margin from top.
  cnv.position(x, y);

  nameLabel.position(x+width+25, y);
  nameInput.position(x+width+25, y+35);
  clearButton.position(x+width+25, y+75);
}
