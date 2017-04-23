var cnv;  //Canvas object.
var bckColor; //Backgorund color.
var digraph;  //Directed graph data structure.
var takenNames = []; //Array of taken vertex names for checking.
var selected = null; //Currently selected vertex for edge creation.
var selLine = [4]; //Array of two points for drawing a selection line.

var pointSize = 40;
var lineSize = 5;
var scl = 20;

var interface;  //Div surrounding input options.
var nameLabel; //Label for name input.
var nameInput; //Name input of vertices.
var lengthLabel;  //Label for the length input.
var lengthInput;  //Length input of edges;
var lengthType;   //Checkbox for switching length type.
var clearButton; //Button for clearing points.
var submitButton; //Button for submitting.

/*
 * Initialize user interface.
 */
function setup() {
  cnv = createCanvas(1004, 801);
  bckColor = color(54, 63, 69);
  digraph = new Digraph();
  setInterface();
  centerElements();
}

/*
 * Looped through p5.
 */
function draw(){
  background(54, 63, 69); //Set background of sketch.
  if(lengthType.checked()){
    drawGrid();
  }
  if(selected !== null){  //If a vertex is currently...
    //Draw the line updated by mouseMove.
    stroke(154, 184, 196, 200);
    strokeWeight(lineSize);
    mouseMoved(); //Utility call to prevent graphics error.
    line(selLine[0], selLine[1], selLine[2], selLine[3]);
  }
  digraph.draw(); //Draws the vertices and edges.
}

/*
 * Create DOM items through p5 and set necessary IDs.
 */
function setInterface(){
  interface = createDiv('');
  interface.id('interface');
  nameInput = createInput('');
  nameLabel = createP('Next Point Name:');
  lengthInput = createInput('');
  lengthLabel = createP('Next Edge Length:');
  lengthType = createCheckbox('Use coordinates', false);
  lengthType.mousePressed(changeLengthType);
  submitButton = createButton('Submit');
  submitButton.id('submit');
  submitButton.mousePressed(submit);
  clearButton = createButton('Clear');
  clearButton.id('clear');
  clearButton.mousePressed(clearGraph);
}

function drawGrid(){
  let cols = width/scl;
  let rows = height/scl;
  strokeWeight(1);
  stroke(40);
  for(let x=0; x<=cols; x++){
    line(x*scl, 0, x*scl, height);
  }
  for(let y=0; y<=rows; y++){
    line(0, y*scl, width, y*scl);
  }
}

/*
 * Submit the current graph to the server.
 */
function submit() {
    console.log("this is the submit button");
    $.ajax({
	url: '/input/adjgraph/',
	type: 'POST',
	data: JSON.stringify(digraph.matrix),
	contentType: 'application/json; charset=utf-8',
	dataType: 'json',
	async: false,
	success: function(msg) {
            alert(msg);
	}
    });
    $.ajax({
	url: '/input/vertices/',
	type: 'POST',
	data: JSON.stringify(digraph.matrix),
	contentType: 'application/json; charset=utf-8',
	dataType: 'json',
	async: false,
	success: function(msg) {
            alert(msg);
	}
    });
}

/*
 * Update length input based on checkbox.
 */
function changeLengthType(){
  if(!lengthType.checked()){
    lengthInput.attribute('disabled', 'true');
  }else{
    lengthInput.removeAttribute('disabled');
  }
}

/*
 *  Create a new blank graph.
 */
function clearGraph(){
  digraph = new Digraph();
  takenNames = [];
}

/*
 * Called when the mouse is initially pushed down, and checks whether to
 * create a new edge, create a new selected vertex, or to add a vertex.
 */
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
      if(lengthType.checked() || (lengthInput.value() != '' && (!isNaN(lengthInput.value())))){
        digraph.addEdge(selected, collision, lengthInput.value());
      }
      selected = null;
    }
  }
}

/*
 * Creates the coordinates for a line that goes from the currently selected
 * vertex to the mouse's current coordinates.
 */
function mouseMoved(){
  if(selected !== null){
    selLine[0] = digraph.vertices[selected]['x'];
    selLine[1] = digraph.vertices[selected]['y'];
    selLine[2] = mouseX;
    selLine[3] = mouseY;
  }
}

/*
 *  Check if the mouse has clicked a vertex.
 */
function checkClick(x, y){
  for(let key in digraph.vertices){
    if(dist(digraph.vertices[key]['x'], digraph.vertices[key]['y'], x, y) < pointSize/2){
      return key;
    }
  }
  return null;
}

/*
 * Ensure that the clicked coordinates are within the canvas and that the name
 * is not taken or empty, and create a new vertex at the mouse coordiantes if so.
 */
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
      }
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
  let x = (windowWidth-width)/2-100;  //Center horizontally.
  let y = 100; //Margin from top.
  cnv.position(x, y);

  interface.position(x+width, y);
  nameLabel.position(x+width+25, y+10);
  nameInput.position(x+width+25, y+50);
  lengthLabel.position(x+width+25, y+75);
  lengthInput.position(x+width+25, y+115);
  lengthType.position(x+width+25, y+150);
  clearButton.position(x+width+25, y+190);
  submitButton.position(x+width+25, y + 230);
}
