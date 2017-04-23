var cnv;  //Canvas object.
var bckColor; //Backgorund color.
var digraph;  //Directed graph data structure.
var takenNames = []; //Array of taken vertex names for checking.
var selected = null; //Currently selected vertex for edge creation.
var selLine = [4]; //Array of two points for drawing a selection line.
var pointSize = 40;
var lineSize = 5;

var interface;  //Div surrounding input options.
var nameLabel; //Label for name input.
var nameInput; //Name input.
var clearButton; //Button for clearing points.
var submitButton; //Button for submitting.

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

/*
 * Looped through p5.
 */
function draw(){
  background(54, 63, 69);
  if(selected !== null){
    stroke(154, 184, 196, 200);
    strokeWeight(lineSize);
    mouseMoved();
    line(selLine[0], selLine[1], selLine[2], selLine[3]);
  }
  digraph.draw();
}

function setInterface(){
  interface = createDiv('');
  interface.id('interface');
  nameInput = createInput('');
  nameLabel = createP('Next Point\'s Name:');
  submitButton = createButton('Submit');
  submitButton.id('submit');
  submitButton.mousePressed(submit);
  clearButton = createButton('Clear');
  clearButton.id('clear');
  clearButton.mousePressed(clearGraph);
}


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
  clearButton.position(x+width+25, y+90);
  submitButton.position(x+ width+25, y + 130);
}
